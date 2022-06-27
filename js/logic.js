  // We create the tile layer that will be the background of our map.
// Create the map object with center and zoom level.
let map = L.map("map").setView([30, 30], 2);

let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: API_KEY
});

let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

streets.addTo(map);
let airportData = "https://raw.githubusercontent.com/Exon0t/Mapping_Earthquakes/main/main/majorAirports.json";
// Create a base layer that holds both maps.
let baseMaps = {
  Street: streets,
  Dark: dark
};

// Grabbing our GeoJSON data.
d3.json(airportData).then(function(data) {
    console.log(data);
    
    // Creating a GeoJSON layer with the retrieved data.
    L.geoJson(data, {
      // We turn each feature into a marker on the map.
      pointToLayer: function(feature, latlng) {
        console.log(feature);
        return L.marker(latlng)
        .bindPopup("<h2>" + feature.properties.city + "</h2><hr> <h3>" + "<h4>" + feature.properties.country + "<h4/>");
      }}
      
      ).addTo(map);
      
});

// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps).addTo(map);