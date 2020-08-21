'use strict';
$(document).ready(() => {
    loadMap()
})

const map = L.map('map', {
    center: [13.448474, 101.181245],
    zoom: 14
});

// var drawnItems = L.featureGroup();
const geoserv = "https://rti2dss.com:8443/geoserver/wms?";

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

    const aa = 'http://tile.openweathermap.org/map/temp_new/3/3/1.png?appid=d22d9a6a3ff2aa523d5917bbccc89211'
    const bb = 'http://maps.openweathermap.org/maps/2.0/weather/WND/{z}/{x}/{y}?date=1592303284363&use_norm=true&arrow_step=16&appid=c1492da641a49167c53363a5e22ab7ef'
    const cc = 'http://maps.openweathermap.org/maps/2.0/weather/PA0/{z}/{x}/{y}?date=1592303284363&appid=c1492da641a49167c53363a5e22ab7ef'
    const dd = 'http://maps.openweathermap.org/maps/2.0/weather/TA2/{z}/{x}/{y}?date=1592303284363&opacity=0.9&fill_bound=true&palette=0:FF0000;10:00FF00;20:0000FF&appid=c1492da641a49167c53363a5e22ab7ef'

    const OWM_API_KEY = 'c1492da641a49167c53363a5e22ab7ef';

    var clouds = L.OWM.clouds({ opacity: 0.8, legendImagePath: 'files/NT2.png', appId: OWM_API_KEY });
    var cloudscls = L.OWM.cloudsClassic({ opacity: 0.5, appId: OWM_API_KEY });
    var precipitation = L.OWM.precipitation({ opacity: 0.5, appId: OWM_API_KEY });
    var precipitationcls = L.OWM.precipitationClassic({ opacity: 0.5, appId: OWM_API_KEY });
    var rain = L.OWM.rain({ opacity: 0.5, appId: OWM_API_KEY });
    var raincls = L.OWM.rainClassic({ opacity: 0.5, appId: OWM_API_KEY });
    var snow = L.OWM.snow({ opacity: 0.5, appId: OWM_API_KEY });
    var pressure = L.OWM.pressure({ opacity: 0.4, appId: OWM_API_KEY });
    var pressurecntr = L.OWM.pressureContour({ opacity: 0.5, appId: OWM_API_KEY });
    var temp = L.OWM.temperature({ opacity: 0.5, appId: OWM_API_KEY });
    var wind = L.OWM.wind({ opacity: 0.5, appId: OWM_API_KEY });



    // const temp = L.tileLayer(cc);

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
        transparent: true
    });

<<<<<<< HEAD
    const pk_green_4326 = L.tileLayer.wms("http://119.59.125.134:8080/geoserver/wms?", {
        layers: 'green:pk_green_13aug20_32647',
=======
    const pk_green_4326 = L.tileLayer.wms(geoserv, {
        layers: 'green:pk_green_4326',
>>>>>>> aba3370a468eaca4aaf8e4cbfe1a3f02deda8e92
        format: 'image/png',
        transparent: true
    });

    const pk_os_4326 = L.tileLayer.wms(geoserv, {
        layers: 'green:pk_os_4326',
        format: 'image/png',
        transparent: true
    });

    const pk_streams_4326 = L.tileLayer.wms(geoserv, {
        layers: 'green:pk_streams_4326',
        format: 'image/png',
        transparent: true
    });

    const pk_trans_4326 = L.tileLayer.wms(geoserv, {
        layers: 'green:pk_trans_4326',
        format: 'image/png',
        transparent: true
    });


    const pk_vill = L.tileLayer.wms(geoserv, {
        layers: 'green:pk_vill',
        format: 'image/png',
        transparent: true,
        maxZoom: 20
    });

    const baseMap = {
        "OSM": osm.addTo(map),
        "แผนที่ถนน (google)": grod,
        "แผนที่ภาพถ่าย (google)": ghyb
    }

    const overlayMap = {
        "temp": temp,
        "สิ่งปลูกสร้าง": pk_bu_4326.addTo(map),
        "พื้นที่สีเขียว": pk_green_4326.addTo(map),
        "พื้นที่เปิดโล่ง": pk_os_4326.addTo(map),
        "แม่น้ำ": pk_streams_4326.addTo(map),
        "ถนน": pk_trans_4326.addTo(map),
        "แปลงที่ดิน": parcel.addTo(map),
        "ชุมชน": pk_vill
    }

    L.control.layers(baseMap, overlayMap).addTo(map);

    getWeather(map.getCenter());
    draw();

    // map.on('dragend', e => {
    //     getWeather(map.getCenter());
    // })

    map.on('click', e => {
        getWeather(e.latlng);
    })
}

function getWeather(c) {
    console.log(c.lat)
    let url = `http://api.openweathermap.org/data/2.5/weather?lat=${c.lat}&lon=${c.lng}&units=metric&appid=347fb1dc79fee191dce2f5ef8d198c9d`
    $.get(url).done(res => {
        // console.log(res)
        $('#temp').html('เฉลี่ย ' + res.main.temp + '&#8451;');
        $('#temp_min').html('ต่ำสุด ' + res.main.temp_min + '&#8451;');
        $('#temp_max').html('สูงสุด ' + res.main.temp_max + '&#8451;');
    })
}

var arrLyr = [];
function draw() {
    var options = {
        position: 'topleft', // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
        drawMarker: false,
        drawCircleMarker: false,
        drawPolyline: false,
        drawRectangle: true,
        drawPolygon: true,
        drawCircle: false,
        cutPolygon: false,
        editMode: true,
        removalMode: true,
        snappable: true,
        snapDistance: 20
    };

    map.pm.setPathOptions({
        color: 'orange',
        fillColor: 'green',
        fillOpacity: 0.3,
    });

    map.pm.addControls(options);

    // listen to when a new layer is created
    let i = 0;
    map.on('pm:create', e => {

        let lid = e.layer._leaflet_id;
        let area = turf.area(e.layer.toGeoJSON().geometry);
        arrLyr.push({ id: i, lid: lid, area: area, bound: e.layer.getBounds() });
        i += 1;
        updateArea(arrLyr);

        e.layer.on('pm:edit', f => {
            arrLyr.map(obj => {
                if (obj.lid === f.target._leaflet_id) {
                    obj.area = turf.area(f.target.toGeoJSON().geometry);
                    obj.bound = f.target.getBounds();
                }
            })
            // console.log(arrLyr)
            updateArea(arrLyr);
        })
    });

    map.on('pm:remove', d => {
        removeItem(d.layer._leaflet_id);
    })
}

let items;
function updateArea(obj) {
    items = obj;
    $('#inner').empty();
    let id = 0;
    let sumArea = 0;
    obj.map(i => {
        sumArea += i.area;
        id += 1;
        let tt = calTemp(i.area)
        $('#inner').append('<a class="list-group-item list-group-item-action" onclick="fitBound(' + i.lid + ')">' + id +
            '. เนื้อที่ ' + (i.area).toLocaleString(undefined, { maximumFractionDigits: 2 }) +
            ' ตร.ม.  <span class="badge badge-warning float-right">-' + tt.toFixed(2) + '&#8451;</span></a>');
    })

    $('#count').html('พื้นที่สีเขียวจำนวน ' + obj.length + ' แห่ง รวม <span class="f-orange">' +
        (sumArea).toLocaleString(undefined, { maximumFractionDigits: 2 }) + '</span> ตร.ม.');
    let t = calTemp(sumArea);
    $('#tmpDown').html('<h3><span class="badge badge-success">อุณหภูมิลดลง ' + t.toFixed(2) + '&#8451;</span></h3>');
}

async function removeItem(d) {
    await items.forEach((e, i) => {
        if (e.lid == d) {
            items.splice(i, 1)
        }
        // console.log(i)
    })
    updateArea(arrLyr);
}

async function fitBound(b) {
    let item = await items.find(x => x.lid == b)
    map.fitBounds(item.bound)
}

$('#coef').val(0.00001);
function calTemp(area) {
    let coef = $('#coef').val()
    let t = area * coef;
    return t;
}

$('#coef').change(e => {
    // let t = calTemp(sumArea);
    // $('#tmpDown').html('<h3><span class="badge badge-success">อุณหภูมิลดลง ' + t.toFixed(2) + '&#8451;</span></h3>');
    updateArea(arrLyr);
})

