// var satMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
// });
// var grayMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
// });
// var outdoorMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
// });
// outdoorMap.addTo(myMap)
// // SatMap.addTo(myMap)
// .addTo(myMap);

var satMap= L.tileLayer("https://api.mapbox.com/styles/v1/jennifermarie6sl/ckulhx10w20rw17s7mxq4nvya/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v9",
    accessToken: API_KEY
});

var grayMap= L.tileLayer("https://api.mapbox.com/styles/v1/jennifermarie6sl/ckuli2tdi4f0817qxfqtc5031/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v10",
    accessToken: API_KEY
});

var outdoorMap= L.tileLayer("https://api.mapbox.com/styles/v1/jennifermarie6sl/ckulhx10w20rw17s7mxq4nvya/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

// Create our map, giving it the streetmap and earthquakes layers to display on load.
var myMap = L.map("mapid", {
  center: [
    37.09, -95.71
  ],
  zoom: 3,
  layers: [satMap, grayMap, outdoorMap],
});

// Create baseMaps object for the corner.
var baseMaps = {
  "Satellite": satMap,
  "Grayscale": grayMap,
  "Outdoors": outdoorMap
};

var tectonicPlates = new L.layerGroup();
var Earthquakes = new L.layerGroup();

// Create an overlay object.
var overlayMaps = {
  "Tectonic Plates": tectonicPlates,
  "Earthquakes": Earthquakes
};

// Create a layer control, pass it our baseMaps and overlayMaps.
// Add the layer control to the map.  Allows you to control the toggle buttons
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
var platesUrl = "https://github.com/fraxen/tectonicplates/blob/master/original/PB2002_boundaries.dig.txt"

// Perform a GET request to the query URL/
d3.json(queryUrl, function (data) {
  console.log("data")
  console.log(data)

  var features = data.features
  console.log("features")
  console.log(features)

  console.log("features.length")
  console.log(features.length)

  // Loop through locations.
  for (var i = 0; i < features.length; i++) {
    var location = [features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]];
    var depth = features[i].geometry.coordinates[2];
    var magnitude = features[i].properties.mag;
    var color = "";

    // Start from highest number and go down.
    if (depth > 90) {
      color = "#E62817";
    }
    else if (depth > 70) {
      color = "#E66317";
    }
    else if (depth > 50) {
      color = "#E6CA17";
    }
    else if (depth > 30) {
      color = "#78E617";
    }
    else if (depth > 10) {
      color = "#17E6DF";
    }
    else {
      color = "#D4EE00";
    }
    
    // Add circles to the map.
    L.circle(location, {
      fillOpacity: 1,
      color: "white",
      fillColor: color,
      
      // Adjust the radius.
      radius: magnitude * 20000
    }).bindPopup("<h1>" + features[i].properties.place + "</h2> <hr> <h3>Points: " + features[i].properties.mag + "</h3>").addTo(myMap);
  };

// function createFeatures(earthquakeData) {
//     // Create a GeoJSON layer that contains the features array on the earthquakeData object.
//     // Run the onEachFeature function once for each piece of data in the array.
//     var earthquakes = L.geoJSON(earthquakeData, {
//         onEachFeature: onEachFeature
//     });

//   // Define a function that we want to run once for each feature in the features array.
//   // Give each feature a popup that describes the place and time of the earthquake.
//   function onEachFeature(feature, layer) {
//     layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}</h3><hr><p>${new Location: (feature.properties.place)}</p>`</h3><hr><p>${new Date(feature.properties.time)}</p>`);
//   };
// };

// function createMap(earthquakes) {


// Set up the legend.  WORKS
var legend = L.control({
  position: "bottomright"
});
legend.onAdd = function () {
  var div = L.DomUtil.create("div", "info legend");
  var grades = [-10, 10, 30, 50, 70, 90];
  var colors = [
      "#98EE00",
      "#D4EE00",
      "#EECC00",
      "#EE9C00",
      "#EA822C",
      "#E62817"
  ];
  // Looping through our intervals to generate a label with a colored square for each interval.
  for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
          + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }
  return div;
};
// Finally, we our legend to the map.
legend.addTo(myMap);

});

// TO DO:
// Plot the tectonic data
// Give buttons access to control plotted data
// 
