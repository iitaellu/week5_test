import L from "leaflet";
let map;
let hashMap = new Map();

//Help from course's sourscodes
const fetchData = async () => {
  const url =
    "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
  const res = await fetch(url);
  const data = await res.json();

  console.log(data);
  createHashMap(data);
  fetchMigration();
  sleep(300).then(() => {
    initMap(data);
  });
};

//From https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const createHashMap = (data) => {
  let size = Object.values(data.features).length;

  Object.values(data).forEach((key) => {
    for (let r = 0; r < size; r++) {
      let idName = "KU" + data.features[r].properties.kunta;

      let myObject = {
        pos: 0,
        neg: 0
      };
      hashMap.set(idName, myObject);
    }
  });
};

const fetchMigration = async () => {
  const url =
    "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f";
  const promis = await fetch(url);
  let posData = await promis.json();

  const url2 =
    "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e";
  const promis2 = await fetch(url2);
  let negData = await promis2.json();

  for (let r = 1; r < 2; r++) {
    Object.keys(posData).forEach((key) => {
      for (var [keys] of hashMap) {
        //help from https://www.codegrepper.com/code-examples/javascript/how+to+iterate+through+a+hashmap+in+javascript
        let id = posData[key].dimension.Tuloalue.category.index[keys];
        var pos = posData[key].value[id];
        var neg = negData[key].value[id];

        let myObject = {
          pos: pos,
          neg: neg
        };
        hashMap.set(keys, myObject);
      }
    });
    console.log(hashMap);
  }
};

const initMap = (data) => {
  map = L.map("map", {
    minZoom: -3
  });

  let geoJson = L.geoJSON(data, {
    weight: 2,
    onEachFeature: getFeature
  }).addTo(map);

  let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  map.fitBounds(geoJson.getBounds());
};

const getFeature = (feature, layer) => {
  if (!feature.id) return;
  let number = feature.properties.kunta;
  let kid = "KU" + number;
  layer.bindPopup(
    `<ul>
        <li>Positive Migration: ${hashMap.get(kid).pos} </li>
        <li>Negative Migration: ${hashMap.get(kid).neg} </li>
    </ul>`
  );

  layer.bindTooltip(feature.properties.name);
};

fetchData();
