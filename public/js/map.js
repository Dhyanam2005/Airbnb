mapboxgl.accessToken = mapToken;

// Make sure listing.geometry.coordinates is a valid array [lng, lat]
if (listing.geometry && Array.isArray(listing.geometry.coordinates)) {
    const coordinates = listing.geometry.coordinates;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]
        zoom: 9 // starting zoom
    });

    console.log(coordinates);

    // Make sure listing.location is defined
    if (listing.location) {
        const marker = new mapboxgl.Marker({ color: "red" })
            .setLngLat(coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`))
            .addTo(map);
    } else {
        console.error("Location information is missing.");
    }
} else {
    console.error("Invalid coordinates data in listing.geometry.coordinates.");
}
