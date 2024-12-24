const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { response } = require("express");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });



module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path : "reviews",
        populate : {
            path : "author",
        },
    }).populate("owner");
    if (!listing) {
        req.flash("error","Listing you requested does not exists")
        res.redirect("/listings");
    }
    console.log(listing)
    res.render("./listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {

        let response = await geocodingClient.forwardGeocode({
                query: req.body.listing.location,
                limit: 1,
            })
            .send();
        let url = req.file.path;
        let filename = req.file.filename;
        const result = listingSchema.validate(req.body);
        if (result.error) {
            throw new ExpressError(400, result.error);
        }
        const newListing = new Listing(req.body.listing);
        newListing.image = { url,filename };
        newListing.owner = req.user._id;
        newListing.geometry = response.body.features[0].geometry;
        let savedListing = await newListing.save();
        console.log(savedListing);
        req.flash("success","New listing created")
        res.redirect("/listings");   
}

module.exports.renderEditForm = async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error","Listing you requested does not exists")
            res.redirect("/listings");
        }
        let originalImageURL = listing.image.url;
        originalImageURL = originalImageURL.replace("/upload","/upload/h_300,w_250");
        res.render("./listings/edit.ejs", { listing , originalImageURL });
}

module.exports.updateListing = async (req, res) => {
        const { id } = req.params;
        let listing = Listing.findById(id);
        const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
        if(typeof req.file !== "undefined"){
            let url = req.file.path;
            let filename = req.file.filename;
            updatedListing.image = { url ,filename };
            await updatedListing.save();
        }
        req.flash("success","Listing updated");
        res.redirect(`/listings/${updatedListing._id}`);
}

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted")
    res.redirect("/listings");
}