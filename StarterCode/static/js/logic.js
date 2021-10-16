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

var grayMap= L.tileLayer("https://api.mapbox.com/styles/v1/jennifermarie6sl/{style_id}/tiles/{tilesize}/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tilesize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    style_id: "mapbox.mapbox-terrain-v2",
    accessToken: API_KEY
});

var satMap= L.tileLayer("https://api.mapbox.com/styles/v1/jennifermarie6sl/{style_id}/tiles/{tilesize}/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tilesize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    style_id: "mapbox.satellite", 
    accessToken: API_KEY
});

var outdoorMap= L.tileLayer("https://api.mapbox.com/styles/v1/jennifermarie6sl/{style_id}/tiles/{tilesize}/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tilesize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    style_id: "mapbox.country-boundaries-v1",
    accessToken: API_KEY
});

// Create our map, giving it the streetmap and earthquakes layers to display on load.
var myMap = L.map("mapid", {
  center: [
    37.09, -95.71
  ],
  zoom: 3,
  layers: [satMap, outdoorMap, grayMap],
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
      
      // Adjust the radius and add to the Earthquakes overlay object.
      radius: magnitude * 20000
    }).bindPopup("<h1>" + features[i].properties.place + "</h2> <hr> <h3>Points: " + features[i].properties.mag + "</h3>").addTo(Earthquakes);
    
    Earthquakes.addTo(myMap)
  };

  var platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Perform a GET request to the query URL/
  d3.json(platesUrl, function (platedata) {
    // Adding our geoJSON data, along with style information, to the tectonicplates layer.
    L.geoJson(platedata, {
      color: "orange",
      weight: 2
    }).addTo(tectonicPlates);

    // Add the tectonicplates layer to the map.
    tectonicPlates.addTo(myMap);
  });

// Set up the legend and add legend to the map.
var legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");

    var limits = [-10, 10, 30, 50, 70, 90];
    var colors = [
      "#D4EE00",
      "#17E6DF",
      "#78E617",
      "#E6CA17",
      "#E66317",
      "#E62817"
    ];

    for (var i = 0; i < limits.length; i++) {
      div.innerHTML += "<i style= 'background:" + colors[i] + "'></i> "
        + limits[i] + (limits[i + 1] ? "&ndash;" + limits[i + 1] + "<br>" : "+");
    }
    return div;
  };
  // Adding the legend to the map
  legend.addTo(myMap);

});