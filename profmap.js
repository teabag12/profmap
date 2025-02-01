// profmap.js

// Initialize profiteers list
// TODO: this is just sample data -> change that later to the actual list by reading the data either from a file or by a database query
// TODO: discuss with Fine what kind of data should be displayed within in the map, e.g. short desciption? Then implement this
const profiteers_hq = [
    { name: "Profiteer 1-1", coords: [48.8566, 2.3522] },   // Paris, France
    { name: "Profiteer 1-2", coords: [48.8566, 2.3522] },   // Another marker in Paris, France
    { name: "Profiteer 2", coords: [41.9028, 12.4964] },  // Rome, Italy
    { name: "Profiteer 3", coords: [40.4168, -3.7038] },  // Madrid, Spain
    { name: "Profiteer 4", coords: [52.5200, 13.4050] },  // Berlin, Germany
    { name: "Profiteer 5", coords: [51.5074, -0.1278] },  // London, UK
    { name: "Profiteer 6", coords: [36.8065, 10.1815] },  // Tunis, Tunisia
    { name: "Profiteer 7", coords: [37.9838, 23.7275] },  // Athens, Greece
    { name: "Profiteer 8", coords: [30.0444, 31.2357] },  // Cairo, Egypt
    { name: "Profiteer 9", coords: [48.2082, 16.3738] }, // Vienna, Austria
];
const profiteers_br = [
    { name: "Profiteer 1-3", coords: [48.8566, 2.3522] },   // Another marker in Paris, France
    { name: "Profiteer 10", coords: [50.1109, 8.6821] },   // Frankfurt, Germany
    { name: "Profiteer 11", coords: [43.6629, 7.2491] },   // Nice, France
    { name: "Profiteer 12", coords: [43.2921, 5.3744] },  // Marseille, France
    { name: "Profiteer 13", coords: [43.8351, 7.4269] },  // Nice, France (another marker in the same city)
    { name: "Profiteer 14", coords: [48.7889, 2.2770] },  // Villejuif, France
    { name: "Profiteer 15", coords: [49.4444, 1.0917] },  // Rouen, France
    { name: "Profiteer 16", coords: [48.1173, -1.6778] }, // Rennes, France
    { name: "Profiteer 17", coords: [43.6108, 3.8772] },  // Montpellier (close to an existing marker)
];

// Define color and opacity for circular markers. Styling of cluster and square markers is set in the CSS-file
const markerColor = '#8B0000'; // Dark red 
const markerOpacity = 0.8;
const markerRadius = 3;
const hqMarkerScale = 4; // Scaling factor for markers of headquarters in relation to markers for branches

// Initialize the map
var map = L.map('map').setView([40, 15], 4);


// Add Esri tiles to the map
// TODO: first of all, this map is NOT open source. It can only be used 1 mio times per month max! -> fine for now I think
// TODO: add personal API key to backend (?) (current API valid until 13 November 2025)
const apiKey = '...';

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}?apikey='+apiKey, {
	attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
	maxZoom: 9
}).addTo(map);

// Create a marker cluster group
var markers = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
        var count = cluster.getChildCount();
        return L.divIcon({
            html: '<div class="custom-cluster-icon">' + count + '</div>',
            className: 'custom-cluster-icon',
            iconSize: L.point(30, 30)
        });
    },
    showCoverageOnHover: false,
    spiderLegPolylineOptions: { weight: 1.5, color: '#222', opacity: 0.5 },
    spiderfyDistanceMultiplier: 1.3,
    maxClusterRadius: 20 // Determines how close markers need to be to be clustered
});

// Define function to check if a given profiteer represents a headquarter or a branch and assign a marker accordingly
function createMarkers(profiteers, type) {
    profiteers.forEach(function(profiteer) {
        let marker;

        if (type === 'Headquarters') {
            marker = L.marker(profiteer.coords, {
                icon: L.divIcon({
                    className: 'square-marker',
                    html: '<div style="width: ' + (markerRadius * hqMarkerScale) + 'px; height: ' + (markerRadius * hqMarkerScale) + 'px;"></div>',
                    iconSize: [markerRadius * hqMarkerScale, markerRadius * hqMarkerScale]
                })
            });     
        } else {
            // Circular marker for branches
            marker = L.circleMarker(profiteer.coords, {
                color: markerColor,
                fillColor: markerColor,
                fillOpacity: markerOpacity,
                radius: markerRadius
            });
        }

        // Bind a popup with the name and coordinates
        marker.bindPopup('<b>' + profiteer.name + '</b><br><em>' + type + '</em><br>Location: ' + profiteer.coords[0] + ', ' + profiteer.coords[1]);

        // Add marker to the cluster group
        markers.addLayer(marker);
    });
}

createMarkers(profiteers_hq, 'Headquarters');
createMarkers(profiteers_br, 'Branch');

// Add marker cluster group to the map
map.addLayer(markers);
