// We create the tile layer that will be the background of our map.
// Create the map object with center and zoom level.
let map = L.map("map").setView([30, 30], 2);
let myStyle = {
  color: "#ffffa1",
  weight: 2
}
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/light-v10',
  accessToken: API_KEY
});

let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  accessToken: API_KEY
});

streets.addTo(map);
let airportData = "https://raw.githubusercontent.com/Exon0t/Mapping_Earthquakes/main/main/majorAirports.json";
let torontoData = "https://raw.githubusercontent.com/Exon0t/Mapping_Earthquakes/main/main/torontoRoutes.json";
let torontoHoods = "https://raw.githubusercontent.com/Exon0t/Mapping_Earthquakes/main/main/torontoNeighborhoods.json";
// Create a base layer that holds both maps.
let baseMaps = {
  Street: streets,
  Dark: dark
};

let earthquakes = new L.layerGroup();
let overlays = {
  Earthquakes: earthquakes
};


// // Grabbing our GeoJSON data.
// d3.json(airportData).then(function (data) {
//   console.log(data);

//   // Creating a GeoJSON layer with the retrieved data.
//   L.geoJson(data, {
//     // We turn each feature into a marker on the map.
//     pointToLayer: function (feature, latlng) {
//       console.log(feature);
//       return L.marker(latlng)
//         .bindPopup("<h2>" + feature.properties.city + "</h2><hr> <h3>" + "<h4>" + feature.properties.country + "<h4/>");
//     }
//   }

//   ).addTo(map);

// });

// // Grabbing our GeoJSON data.
// d3.json(torontoData).then(function (data) {
//   console.log(data);
//   // Creating a GeoJSON layer with the retrieved data.
//   L.geoJSON(data, {
//     style: myStyle
//   }).addTo(map);
// });

// d3.json(torontoHoods).then(function (data) {
//   L.geoJSON(data).addTo(map)
// })

// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };

    function getRadius(magnitude) {
      if (magnitude === 0) {
        return 1;
      }
      return magnitude * 4;
    }
    function getColor(magnitude) {
      if (magnitude > 5) {
        return "#ea2c2c";
      }
      if (magnitude > 4) {
        return "#ea822c";
      }
      if (magnitude > 3) {
        return "#ee9c00";
      }
      if (magnitude > 2) {
        return "#eecc00";
      }
      if (magnitude > 1) {
        return "#d4ee00";
      }
      return "#98ee00";
    }

  }

  // Creating a GeoJSON layer with the retrieved data.
  L.geoJSON(data, {

    // We turn each feature into a circleMarker on the map.

    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    // We create a popup for each circleMarker to display the magnitude and
    //  location of the earthquake after the marker has been created and styled.
    onEachFeature: function (feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }

  }).addTo(earthquakes);
});
// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps, overlays).addTo(map);

// Create a legend control object.
let legend = L.control({
  position: "bottomright"
});

// Then add all the details for the legend.
legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");
  const magnitudes = [0, 1, 2, 3, 4, 5];
  const colors = [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c"
  ];
  // Looping through our intervals to generate a label with a colored square for each interval.
  for (var i = 0; i < magnitudes.length; i++) {
    console.log(colors[i]);
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
 }
  return div;
};
legend.addTo(map);