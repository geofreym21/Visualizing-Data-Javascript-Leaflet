// geoJSON URL in USGS about earthquakes for the week

var earthquakesUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(earthquakesUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data.features);
  createFeatures(data.features);


});
    // Determine the color of markers based on Earthquakes' magnitude
    function chooseColor(magnitude) {
      switch (true) {
      case magnitude > 5:
          return "#581845";
      case magnitude > 4:
          return "#900C3F";
      case magnitude > 3:
          return "#C70039";
      case magnitude > 2:
          return "#FF5733";
      case magnitude > 1:
          return "#FFC300";
      default:
          return "#DAF7A6";
      }
  }

// Circular function features
function createFeatures(earthquakeData) {
  var earthquakes = L.geoJson(earthquakeData,{
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag*4,
        fillColor: chooseColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9})
        .bindPopup("<h3>" + "Location: " + feature.properties.place +
          "</h3><hr><p>" + "Date/Time: " + new Date (feature.properties.time) + "<br>" +
          "Magnitude: " + feature.properties.mag + "</p>");
  }
});

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Satellite map (base layer)
  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  })
  // Streets map (alternative layer)
  var streetsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  })

  // Base map objects
  var baseMaps = {
    "satellite": satelliteMap,
    "street": streetsMap
  };

  // Overlay map object 
  var overlayMaps = {
    earthquakes: earthquakes
  };

  // Default map layer
  var myMap = L.map("map", {
    center: [41.8719, 12.5674],
    zoom: 2,
    layers: [satelliteMap, earthquakes]
  });
    console.log(myMap);

//   Layer control for baseMaps and overlayMaps
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
   }).addTo(myMap);
  // Set Up Legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"), 
    magnitudeLevels = [0, 1, 2, 3, 4, 5];

    div.innerHTML += "<h3>Magnitude</h3>"

    for (var i = 0; i < magnitudeLevels.length; i++) {
        div.innerHTML +=
            '<i style="background: ' + chooseColor(magnitudeLevels[i] + 1) + '"></i> ' +
            magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
    }
    return div;
  };
  // Add Legend to the Map
  legend.addTo(myMap);
  
}
