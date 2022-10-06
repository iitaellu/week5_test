import L from "leaflet";

//Help from course's sourscodes
const fetchData = async () => {
  const url =
    "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
  const res = await fetch(url);
  const data = await res.json();

  console.log(data);

  initMap(data);
};

const initMap = (data) => {
  let map = L.map("map", {
    minZoom: -3
  });

  let geoJson = L.geoJSON(data, {
    //weight: 2,
    onEachFeature: getFeature
  }).addTo(map);

	@@ -32,33 +88,16 @@ const initMap = (data) => {

const getFeature = (feature, layer) => {
  if (!feature.id) return;
  //const id = feature.properties.id;
  //console.log(id);
  layer.bindPopup(feature.properties.name);
  layer.bindTooltip(feature.properties.name);
};

fetchData();

/*const fetchData = async () => {
  const url =
    "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
  const res = await fetch(url);
  const data = await res.json();
  initMap(data);
};
const initMap = (data) => {
  let map = L.map("map", {
    minZoom: -3
  })
  let geoJson = L.geoJSON(data, {
    weight: 2
  }).addTo(map);
  map.fitBounds(geoJson.getBounds());
};
fetchData();*/
