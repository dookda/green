'use strict';
$(document).ready(() => {
    loadMap()
})

const map = L.map('map', {
    center: [18.788590, 98.985483],
    zoom: 16
});

// var drawnItems = L.featureGroup();

function loadMap() {
    const osm = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 19,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    });
    const pro = L.tileLayer.wms("http://cgi.uru.ac.th/geoserver/wms?", {
        layers: 'th:province_4326',
        format: 'image/png',
        transparent: true,
        attribution: "#grid"
    });
    const baseMap = {
        "OSM": osm.addTo(map)
    }
    const overlayMap = {
        "ขอบจังหวัด": pro.addTo(map)
    }
    L.control.layers(baseMap, overlayMap).addTo(map);

    getWeather(map.getCenter());
    draw();

    map.on('dragend', e => {
        getWeather(map.getCenter());
    })
}

function getWeather(c) {
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

