// profmap.js

// Initialize profiteers list
// TODO: this is just sample data -> change that later to the actual list. link should be URL of detail page
// If our data contains many non-active companies at some point, we should consider to visually distinguish them, e.g. by changing the marker color accordingly
// Once we have the address for most of the data points, we should maybe display the address instead of the geo-coordinates on the map 
const profiteers = [
    { name: "Aurora Corp", coords: [48.8566, 2.3522], link: "www.auroracorp.com", status: "active" },   // Paris, France
    { name: "Boreal Ltd", coords: [48.8566, 2.3522], link: "www.borealltd.com", status: "non-active" }, // Another marker in Paris, France
    { name: "Celeste Inc", coords: [48.8566, 2.3522], link: "www.celesteinc.com", status: "active" },   // Another marker in Paris, France
    { name: "Domus Ventures", coords: [41.9028, 12.4964], link: "www.domusventures.com", status: "active" },  // Rome, Italy
    { name: "Estrella Group", coords: [40.4168, -3.7038], link: "www.estrellagroup.com", status: "non-active" },  // Madrid, Spain
    { name: "Fjord GmbH", coords: [52.5200, 13.4050], link: "www.fjordgmbh.com", status: "active" },  // Berlin, Germany
    { name: "Globe Holdings", coords: [51.5074, -0.1278], link: "www.globeholdings.com", status: "active" },  // London, UK
    { name: "Helios SA", coords: [36.8065, 10.1815], link: "www.heliossa.com", status: "non-active" },  // Tunis, Tunisia
    { name: "Icarus Partners", coords: [37.9838, 23.7275], link: "www.icaruspartners.com", status: "active" },  // Athens, Greece
    { name: "Juno Enterprises", coords: [30.0444, 31.2357], link: "www.junoenterprises.com", status: "active" },  // Cairo, Egypt
    { name: "Kite AG", coords: [48.2082, 16.3738], link: "www.kiteag.com", status: "non-active" }, // Vienna, Austria
    { name: "Luna Ventures", coords: [50.1109, 8.6821], link: "www.lunaventures.com", status: "active" },   // Frankfurt, Germany
    { name: "Marble Group", coords: [43.6629, 7.2491], link: "www.marblegroup.com", status: "active" },   // Nice, France
    { name: "Nexus Corp", coords: [43.2921, 5.3744], link: "www.nexuscorp.com", status: "active" },  // Marseille, France
    { name: "Orion LLC", coords: [43.8351, 7.4269], link: "www.orionllc.com", status: "non-active" },  // Nice, France (another marker in the same city)
    { name: "Pinnacle SA", coords: [48.7889, 2.2770], link: "www.pinnaclesa.com", status: "active" },  // Villejuif, France
    { name: "Quasar Ltd", coords: [49.4444, 1.0917], link: "www.quasarltd.com", status: "active" },  // Rouen, France
    { name: "Riviera Group", coords: [48.1173, -1.6778], link: "www.rivieragroup.com", status: "active" }, // Rennes, France
    { name: "Solstice Inc", coords: [43.6108, 3.8772], link: "www.solsticeinc.com", status: "non-active" }  // Montpellier (close to an existing marker)
];



// Styling for circular markers
const markerColor = '#8B0000'; // Dark red 
const markerOpacity = 0.8;
const markerRadius = 3;

// Styling for clusters (additional styling for cluster icon in style sheet)
const clusterMaxRadius = 20;        // How close markers must be to cluster
const clusterSpiderfyMultiplier = 1.3;
const clusterLineColor = '#222';
const clusterLineWeight = 1.5;
const clusterLineOpacity = 0.5;

const clusterIconSize = L.point(30, 30);
const clusterIconClass = 'custom-cluster-icon';

// Set limits of bounding box of the map (here: world bounds)
const southWest = L.latLng(-90, -180);
const northEast = L.latLng(90, 180);
const bounds = L.latLngBounds(southWest, northEast);


// Initialize the map
var map = L.map('map', {
    maxZoom: 9
}).setView([40, 15], 4);


// Add Esri tiles to the map
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
    maxZoom: 9,
    noWrap: false // Makes the base map repeat itself even if user shortly pans over the limits of the bounding box
}).addTo(map);

// Apply max bounds to prevent endless panning
map.setMaxBounds(bounds);


// Create a marker cluster group
var markers = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
        var count = cluster.getChildCount();
        return L.divIcon({
            html: '<div class="custom-cluster-icon">' + count + '</div>',
            className: clusterIconClass,
            iconSize: clusterIconSize
        });
    },
    showCoverageOnHover: false,
    spiderLegPolylineOptions: { 
        weight: clusterLineWeight,
        color: clusterLineColor,
        opacity: clusterLineOpacity
    },
    spiderfyDistanceMultiplier: clusterSpiderfyMultiplier,
    maxClusterRadius: clusterMaxRadius // Determines how close markers need to be to be clustered
});

// Create a circular marker for each profiteer
function createMarkers(profiteers) {
    profiteers.forEach(function(profiteer) {
        // Skip invalid coordinates
        if (
            !profiteer.coords || 
            profiteer.coords.length !== 2 ||
            typeof profiteer.coords[0] !== 'number' ||
            typeof profiteer.coords[1] !== 'number' ||
            profiteer.coords[0] < -90 || profiteer.coords[0] > 90 ||
            profiteer.coords[1] < -180 || profiteer.coords[1] > 180
        ) return;

        // Create a circular marker for others
        const marker = L.circleMarker(profiteer.coords, {
            color: markerColor,
            fillColor: markerColor,
            fillOpacity: markerOpacity,
            radius: markerRadius
        });

        // Bind a popup with name, location etc.
        marker.bindPopup(`
            <b>${profiteer.name}</b><br>
            Location: ${profiteer.coords[0]}, ${profiteer.coords[1]}<br>
            Status: ${profiteer.status}<br>
            <a href="https://${profiteer.link}" target="_blank">More details</a>
        `);

        // Add marker to the cluster group
        markers.addLayer(marker);
    });
}

createMarkers(profiteers, 'Profiteers');

// Add marker cluster group to the map
map.addLayer(markers);
