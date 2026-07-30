const map = L.map("map").setView([20.5937, 78.9629], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


// Convert location name → latitude & longitude
fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`)
    .then(res => res.json())
    .then(data => {

        if (data.length === 0) {
            console.log("Location not found");
            return;
        }

        const lat = data[0].lat;
        const lon = data[0].lon;

        map.setView([lat, lon], 12);

        L.marker([lat, lon])
            .addTo(map)
            .bindPopup(`<b>${locationName}</b>`)
            .openPopup();
    })
    .catch(err => {
        console.log("Geocoding error:", err);
    });

// const map = L.map("map").setView([28.6139, 77.2090], 10);

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "&copy; OpenStreetMap contributors"
// }).addTo(map);

// L.marker([28.6139, 77.2090])
//     .addTo(map)
//     .bindPopup("Delhi")
//     .openPopup();