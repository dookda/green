'use strict';
$(document).ready(() => {
    loadMap()
    // map.on("locationfound", onLocationFound);
    // map.on("locationerror", onLocationError);
    // map.locate({ setView: true, maxZoom: 16 });
})

let latlng = {
    lat: 13.448474,
    lng: 101.181245
};

const map = L.map('map', {
    center: latlng,
    zoom: 14
});

let marker, gps, dataurl;
// const url = "https://rti2dss.com:3100";
const url = "http://localhost:3000";


const lc = L.control.locate({
    position: 'topleft',
    locateOptions: {
        enableHighAccuracy: true,
    }
});
lc.addTo(map)
// lc.start();
var latlon;

map.on('click', e => {
    console.log(e)
    latlng = e.latlng;
    // console.log(e.latlng)
    $('#lat').val(e.latlng.lat);
    $('#lng').val(e.latlng.lng)
    getLatlng()
})


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

    const pk_bu_4326 = L.tileLayer.wms("http://119.59.125.134:8080/geoserver/wms?", {
        layers: 'green:pk_bu_4326',
        format: 'image/png',
        transparent: true,
        maxZoom: 20
    });

    const pk_green_4326 = L.tileLayer.wms("http://119.59.125.134:8080/geoserver/wms?", {
        layers: 'green:pk_green_4326',
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

    const baseMap = {
        "แผนที่ OSM": osm.addTo(map),
        "แผนที่ถนน (google)": grod,
        "แผนที่ภาพถ่าย (google)": ghyb
    }

    const overlayMap = {
        "ขอบจังหวัด": pro.addTo(map),
        "สิ่งปลูกสร้าง": pk_bu_4326,
        "พื้นที่สีเขียว": pk_green_4326.addTo(map),
        "พื้นที่เปิดโล่ง": pk_os_4326,
        "แม่น้ำ": pk_streams_4326,
        "ถนน": pk_trans_4326,
    }

    L.control.layers(baseMap, overlayMap).addTo(map);

    // getWeather(map.getCenter());
    // draw();

    // map.on('dragend', e => {
    //     getWeather(map.getCenter());
    // })

    // map.on('click', e => {
    //     getWeather(e.latlng);
    // })
}

function getLatlng() {
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
    gps.addTo(map).bindPopup("คุณอยู่ที่นี่").openPopup();
    gps.on("dragend", e => {
        console.log(e);
        $("#lat").val(e.target._latlng.lat);
        $("#lng").val(e.target._latlng.lng);
    });
}

async function getData() {
    // console.log(marker)
    if (marker) {
        map.removeLayer(marker);
    }

    await $.get(url + "/acc-api/pin-getdata", res => {
        marker = L.geoJSON(res, {
            pointToLayer: (feature, latlng) => {

                const icon = './img/caution.svg';
                const iconMarker = L.icon({
                    iconUrl: icon,
                    iconSize: [30, 30],
                    iconAnchor: [15, 20],
                    popupAnchor: [5, -36]
                });
                return L.marker(latlng, {
                    icon: iconMarker,
                    draggable: false
                });
            },
            onEachFeature: (feature, layer) => {
                if (feature.properties) {
                    // console.log(feature.properties.img)
                    let img =
                        "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIC02NCA1MTIgNTEyIiB3aWR0aD0iNTEycHgiPjxwYXRoIGQ9Im01MTIgNTguNjY3OTY5djI2Ni42NjQwNjJjMCAzMi40Mjk2ODgtMjYuMjM4MjgxIDU4LjY2Nzk2OS01OC42Njc5NjkgNTguNjY3OTY5aC0zOTQuNjY0MDYyYy01LjMzNTkzOCAwLTEwLjQ1MzEyNS0uNjQwNjI1LTE1LjE0ODQzOC0yLjEzMjgxMi0yNS4xNzE4NzUtNi42MTMyODItNDMuNTE5NTMxLTI5LjQ0MTQwNy00My41MTk1MzEtNTYuNTM1MTU3di0yNjYuNjY0MDYyYzAtMzIuNDI5Njg4IDI2LjIzODI4MS01OC42Njc5NjkgNTguNjY3OTY5LTU4LjY2Nzk2OWgzOTQuNjY0MDYyYzMyLjQyOTY4OCAwIDU4LjY2Nzk2OSAyNi4yMzgyODEgNTguNjY3OTY5IDU4LjY2Nzk2OXptMCAwIiBmaWxsPSIjZWNlZmYxIi8+PHBhdGggZD0ibTE0OS4zMzIwMzEgMTA2LjY2Nzk2OWMwIDIzLjU2MjUtMTkuMTAxNTYyIDQyLjY2NDA2Mi00Mi42NjQwNjIgNDIuNjY0MDYyLTIzLjU2NjQwNyAwLTQyLjY2Nzk2OS0xOS4xMDE1NjItNDIuNjY3OTY5LTQyLjY2NDA2MiAwLTIzLjU2NjQwNyAxOS4xMDE1NjItNDIuNjY3OTY5IDQyLjY2Nzk2OS00Mi42Njc5NjkgMjMuNTYyNSAwIDQyLjY2NDA2MiAxOS4xMDE1NjIgNDIuNjY0MDYyIDQyLjY2Nzk2OXptMCAwIiBmaWxsPSIjZmZjMTA3Ii8+PHBhdGggZD0ibTUxMiAyNzYuMDU0Njg4djQ5LjI3NzM0M2MwIDMyLjQyOTY4OC0yNi4yMzgyODEgNTguNjY3OTY5LTU4LjY2Nzk2OSA1OC42Njc5NjloLTM5NC42NjQwNjJjLTUuMzM1OTM4IDAtMTAuNDUzMTI1LS42NDA2MjUtMTUuMTQ4NDM4LTIuMTMyODEybDI2MC42OTUzMTMtMjYwLjY5NTMxM2MxNC41MDM5MDYtMTQuNTAzOTA2IDM4LjM5ODQzNy0xNC41MDM5MDYgNTIuOTA2MjUgMHptMCAwIiBmaWxsPSIjMzg4ZTNjIi8+PHBhdGggZD0ibTM2My45NDUzMTIgMzg0aC0zMDUuMjc3MzQzYy01LjMzNTkzOCAwLTEwLjQ1MzEyNS0uNjQwNjI1LTE1LjE0ODQzOC0yLjEzMjgxMi0yNS4xNzE4NzUtNi42MTMyODItNDMuNTE5NTMxLTI5LjQ0MTQwNy00My41MTk1MzEtNTYuNTM1MTU3di02LjYxMzI4MWwxMjIuODc4OTA2LTEyMi44Nzg5MDZjMTQuNTA3ODEzLTE0LjUwNzgxMyAzOC40MDIzNDQtMTQuNTA3ODEzIDUyLjkwNjI1IDB6bTAgMCIgZmlsbD0iIzRjYWY1MCIvPjwvc3ZnPgo=";
                    feature.properties.img == "-" || feature.properties.img == null
                        ? img : (img = feature.properties.img);
                    layer.bindPopup(
                        '<span style="font-family: Kanit; font-size: 16px;"> ' + feature.properties.sname +
                        "</span></br> ประเภท: " + feature.properties.stype +
                        "</br> คำอธิบาย: " + feature.properties.sdesc +
                        '</br> <img src="' + img + '" width="150px">',
                        { maxWidth: "200px" }
                    );
                }
            }
        }).on("click", selectMarker);
        marker.addTo(map);
    });
}

function insertData() {
    $("#status").empty().text("File is uploading...");
    dataurl ? dataurl : (dataurl = "-");
    const obj = {
        sname: $("#sname").val(),
        stype: $("#stype").val(),
        status_fix: "ยังไม่ได้รับการแก้ไข",
        validation: "ยังไม่ได้รับการตรวจสอบ",
        img: dataurl,
        geom: JSON.stringify(gps.toGeoJSON().geometry)
    };

    $.post(url + "/acc-api/pin-insert", obj).done(res => {
        console.log(obj)
        // getData();
        dataurl = null;
        $("form :input").val("");
        $("#preview").attr("src", "");
        $("#status").empty().text("");
        window.close();
    });
    return false;
}



