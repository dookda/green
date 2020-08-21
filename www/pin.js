'use strict';
$(document).ready(() => {
  loadMap()
  getData()
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

const lc = L.control.locate({
  position: 'topleft',
  locateOptions: {
    enableHighAccuracy: true,
  }
});
lc.addTo(map)
// lc.start();
map.on("locationfound", onLocationFound);

map.on("click", (e) => {
  // console.log("wddwwd");
  $("form :input").val("");
  $("#status").empty().text("");

  $("#save").show();
  $("#edit").hide();
  $("#remove").hide();

  // console.log(e.latlng)
  $("#lat").val(e.latlng.lat);
  $("#lng").val(e.latlng.lng);
  changeLatlng();
  getGreen(e.latlng.lat, e.latlng.lng);
});

// const url = 'http://localhost:3000';
const url = "https://rti2dss.com:3400";
const geoserv = "https://rti2dss.com:8443/geoserver/wms?";

$("#edit").hide();
$("#remove").hide();

var pos;
var pkid;

function onLocationFound(e) {
  console.log(e)
}

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

  const pro = L.tileLayer.wms(geoserv, {
    layers: 'th:province_4326',
    format: 'image/png',
    transparent: true,
    attribution: "#grid"
  });

  const parcel = L.tileLayer.wms(geoserv, {
    layers: 'green:parcel',
    format: 'image/png',
    transparent: true,
    maxZoom: 20
  });

  const pk_bu_4326 = L.tileLayer.wms(geoserv, {
    layers: 'green:pk_bu_4326',
    format: 'image/png',
    transparent: true,
    maxZoom: 20
  });

<<<<<<< HEAD
  const pk_green_4326 = L.tileLayer.wms("http://119.59.125.134:8080/geoserver/wms?", {
    layers: 'green:pk_green_13aug20_32647',
=======
  const pk_green_4326 = L.tileLayer.wms(geoserv, {
    layers: 'green:pk_green_4326',
>>>>>>> aba3370a468eaca4aaf8e4cbfe1a3f02deda8e92
    format: 'image/png',
    transparent: true,
    maxZoom: 20
  });

  const pk_os_4326 = L.tileLayer.wms(geoserv, {
    layers: 'green:pk_os_4326',
    format: 'image/png',
    transparent: true,
    maxZoom: 20
  });

  const pk_streams_4326 = L.tileLayer.wms(geoserv, {
    layers: 'green:pk_streams_4326',
    format: 'image/png',
    transparent: true,
    maxZoom: 20
  });

  const pk_trans_4326 = L.tileLayer.wms(geoserv, {
    layers: 'green:pk_trans_4326',
    format: 'image/png',
    transparent: true,
    maxZoom: 20
  });

  const pk_vill = L.tileLayer.wms(geoserv, {
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

function changeLatlng() {
  // console.log(gps);
  if (gps) {
    map.removeLayer(gps);
  }

  latlng = {
    lat: $("#lat").val(),
    lng: $("#lng").val()
  };

  gps = L.marker(latlng, {
    draggable: true,
    name: "p"
  });
  gps.addTo(map).bindPopup("จุดสำรวจ").openPopup();

  gps.on("dragend", e => {
    // console.log(e);
    $("#lat").val(e.target._latlng.lat);
    $("#lng").val(e.target._latlng.lng);
    $("#save").show();
    $("#edit").hide();
    $("#remove").hide();
    getGreen(e.target._latlng.lat, e.target._latlng.lng);
  });

  gps.on("click", e => {
    $("#save").show();
    $("#edit").hide();
    $("#remove").hide();
  })
}

// var canvas = document.getElementById("canvas");
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var cw = canvas.width;
var ch = canvas.height;
var maxW = 640;
var maxH = 640;

var input = document.getElementById('imgfile');
var output = document.getElementById('preview');
input.addEventListener('change', handleFiles);

function handleFiles(e) {
  var img = new Image;
  img.onload = async function () {
    var iw = img.width;
    var ih = img.height;
    var scale = Math.min((maxW / iw), (maxH / ih));
    var iwScaled = iw * scale;
    var ihScaled = ih * scale;
    canvas.width = iwScaled;
    canvas.height = ihScaled;
    ctx.drawImage(img, 0, 0, iwScaled, ihScaled);
    dataurl = await canvas.toDataURL("image/jpeg", 0.5);
    $("#preview").attr("src", dataurl);
  }
  img.src = URL.createObjectURL(e.target.files[0]);
}

function getGreen(lat, lon) {
  $.get(url + "/api/getgreen/" + lat + "/" + lon, res => {
    // console.log(res.data.length)
    if (res.data.length >= 1) {
      $("#greendata").val(res.data[0].name);
      $("#subcode_1").val(res.data[0].subcode_1);
    }
  })
}

async function getData() {
  if (marker) {
    map.removeLayer(marker);
  }

  await $.get(url + "/api/pin-getdata", res => {
    marker = L.geoJSON(res, {
      pointToLayer: (feature, latlng) => {
        let icon = check;

        const iconMarker = L.icon({
          iconUrl: icon,
          iconSize: [25, 25]
        });
        return L.marker(latlng, {
          icon: iconMarker,
          draggable: false
        });
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          feature.properties.img == "-" || feature.properties.img == null
            ? imgdd
            : (imgdd = feature.properties.img);
          layer.bindPopup(
            "ประเภท: " + feature.properties.stype + "</br>" +
            "คำอธิบาย: " + feature.properties.sdesc + "</br>" +
            '<img src="' + imgdd + '" width="250px">',
            {
              maxWidth: 440
            }
          );
        }
      }
    })
    marker.on("click", selectMarker);
    marker.addTo(map);
  });
}


function selectMarker(e) {
  $("#save").hide();

  $("#stype").val(e.layer.feature.properties.stype);
  $("#sdesc").val(e.layer.feature.properties.sdesc);
  $("#edit").show();
  $("#remove").show();
  pos = {
    geom:
      '{"type":"Point","coordinates":[' +
      e.latlng.lng +
      "," +
      e.latlng.lat +
      "]}",
    id: e.layer.feature.properties.id
  };
  pkid = e.layer.feature.properties.pkid;
  $("#status").empty().text("กำลังแก้ใขข้อมูล..");
}

function insertData() {
  $("#status").empty().text("File is uploading...");
  dataurl ? dataurl : (dataurl = "-");
  const obj = {
    stype: $("#stype").val(),
    sdesc: $("#sdesc").val(),
    img: dataurl,
    geom: JSON.stringify(gps.toGeoJSON().geometry)
  };

  $.post(url + "/api/pin-insert", obj).done(res => {
    getData();
    dataurl = "-";
    $("form :input").val("");
    $("#preview").attr("src", "");
    $("#status").empty().text("");
  });
  return false;
}

function editData() {
  dataurl ? dataurl : (dataurl = "-");
  const obj = {
    stype: $("#stype").val(),
    sdesc: $("#sdesc").val(),
    img: dataurl,
    geom: pos.geom,
    id: pos.id
  };
  $.post(url + "/api/pin-update", obj, res => {
    getData();
    $("form :input").val("");
    $("#preview").attr("src", "");
    $("#status")
      .empty()
      .text("");
  });
  return false;
}

function deleteData() {
  const obj = {
    id: pos.id
  };
  $.post(url + "/api/pin-delete", obj, res => {
    getData();
    $("form :input").val("");
    $("#preview").attr("src", "");
    $("#status")
      .empty()
      .text("");
  });
}

function refreshPage() {
  location.reload(true);
}


