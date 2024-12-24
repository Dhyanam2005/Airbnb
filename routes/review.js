const express = require("express");
const router = express.Router({ mergeParams : true });
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn, isOwner , validateListing, isreviewAuthor,validateReview } = require("../middleware.js");

const reviewController = require("../controller/review.js");

router.post("/", 
    isLoggedIn,
    validateReview, 
    wrapAsync(reviewController.createReview)
);

// Route to delete a review for a listing
router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(reviewController.destryReview));

module.exports = router;