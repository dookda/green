'use strict';
$(document).ready(() => {
  loadMap()
})

let latlng = {
  lat: 13.448474,
  lng: 101.181245
};

let map = L.map("map", {
  center: latlng,
  zoom: 15
});

let marker, gps, dataurl;

// const lc = L.control.locate({
//   position: 'topleft',
//   locateOptions: {
//     enableHighAccuracy: true,
//   }
// });
// lc.addTo(map)
// lc.start();

map.on("click", (e) => {

});

// const url = 'http://localhost:3000';

var pos;
var pkid;

function loadMap() {
  const osm = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 19,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
  });

  const grod = L.tileLayer('https://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    lyr: 'basemap'
  });

  const ghyb = L.tileLayer('https://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    lyr: 'basemap'
  });

  const pro = L.tileLayer.wms("http://119.59.125.134:8080/geoserver/wms?", {
    layers: 'th:province_4326',
    format: 'image/png',
    transparent: true,
    attribution: "#grid"
  });

  const parcel = L.tileLayer.wms("http://119.59.125.134:8080/geoserver/wms?", {
    layers: 'green:parcel',
    format: 'image/png',
    transparent: true,
    maxZoom: 20
  });

  const pk_bu_4326 = L.tileLayer.wms("http://119.59.125.134:8080/geoserver/wms?", {
    layers: 'green:pk_bu_4326',
    format: 'image/png',
    transparent: true,
    maxZoom: 20
  });

  const pk_green_4326 = L.tileLayer.wms("http://119.59.125.134:8080/geoserver/wms?", {
    layers: 'green:pk_green_13aug20_32647',
    format: 'image/png',
    transparent: true,
    maxZoom: 20
  });

  const pk_os_4326 = L.tileLayer.wms("http://119.59.125.134:8080/geoserver/wms?", {
    layers: 'green:pk_os_4326',
    format: 'image/png',
    transparent: true,
    maxZoom: 20
  });

  const pk_streams_4326 = L.tileLayer.wms("http://119.59.125.134:8080/geoserver/wms?", {
    layers: 'green:pk_streams_4326',
    format: 'image/png',
    transparent: true,
    maxZoom: 20
  });

  const pk_trans_4326 = L.tileLayer.wms("http://119.59.125.134:8080/geoserver/wms?", {
    layers: 'green:pk_trans_4326',
    format: 'image/png',
    transparent: true,
    maxZoom: 20
  });

  const pk_vill = L.tileLayer.wms("http://119.59.125.134:8080/geoserver/wms?", {
    layers: 'green:pk_vill',
    format: 'image/png',
    transparent: true,
    maxZoom: 20
  });

  const baseMap = {
    "แผนที่ OSM": osm.addTo(map),
    "แผนที่ถนน (google)": grod,
    "แผนที่ภาพถ่าย (google)": ghyb
  }

  const overlayMap = {
    "สิ่งปลูกสร้าง": pk_bu_4326,
    "พื้นที่สีเขียว": pk_green_4326.addTo(map),
    "พื้นที่เปิดโล่ง": pk_os_4326,
    "แม่น้ำ": pk_streams_4326,
    "ถนน": pk_trans_4326,
    "แปลงที่ดิน": parcel.addTo(map),
    "ชุมชน": pk_vill
  }

  L.control.layers(baseMap, overlayMap).addTo(map);
}

function refreshPage() {
  location.reload(true);
}


