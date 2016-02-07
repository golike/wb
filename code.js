/*global d3, L */

(function() {
    'use strict';

    var mapboxAccessToken = 'pk.eyJ1IjoiZ29saWtlIiwiYSI6ImZlMGFlOTI5ZDBkN2YzMTFjNGJmMjBjODg0YTFhM2Q4In0.qzsLfoMQDQA-_pNVyk9xpg';

    var map = new L.Map("map", {
        center: [37.7997068, -122.3558363],
        zoom: 11,
        zoomControl: false
    });

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
        id: 'mapbox.streets',
        attribution: ''
    }).addTo(map);

    d3.json('stations.min.json', function(stations) {
        navigator.geolocation.getCurrentPosition(function(location) {

            var here = {
                latLng: L.latLng(location.coords.latitude, location.coords.longitude)
            };

            L.circle(here.latLng, 7).addTo(map);

            stations.forEach(function(station) {
                station.latLng = L.latLng(station.latitude, station.longitude);
                station.distance = here.latLng.distanceTo(station.latLng);
                L.circle(station.latLng, 7).addTo(map);
            });

            stations.sort(function(a, b) {
                return a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : a.distance >= b.distance ? 0 : NaN;
            });

            d3.json('get-etd.php', function(json) {
                var a = [];

                json.station.forEach(function(station) {
                    processStation(station, a);
                });

                a.sort(function(a, b) {
                    return a.minutes - b.minutes;
                });

                var list = d3.select('#list').append('ol');

                a.forEach(function(estimate) {
                    var plural = '';

                    if (estimate.minutes !== 1) { plural = 's'; }

                    var li = list.append('li')
                        .attr('class', estimate.color.toLowerCase());

                    li.append('h2')
                        .text(estimate.destination + ' train');

                    li.append('p')
                        .text('leaving ' + estimate.station + ' in ' + estimate.minutes + ' minute' + plural);
                });

                if (a.length === 0) {
                    d3.select('#list').append('p')
                        .attr('class', 'notrains')
                        .text('There aren’t any trains headed your way :(');
                }
            });

            var directions = [];
            d3.json('https://api.mapbox.com/v4/directions/mapbox.walking/' + here.latLng.lng + ',' + here.latLng.lat + ';' + stations[0].latLng.lng + ',' + stations[0].latLng.lat + '.json?access_token=' + mapboxAccessToken, function(json) {
                directions.push(json);
                d3.json('https://api.mapbox.com/v4/directions/mapbox.walking/' + here.latLng.lng + ',' + here.latLng.lat + ';' + stations[1].latLng.lng + ',' + stations[1].latLng.lat + '.json?access_token=' + mapboxAccessToken, function(json) {
                    directions.push(json);
                    d3.json('https://api.mapbox.com/v4/directions/mapbox.walking/' + here.latLng.lng + ',' + here.latLng.lat + ';' + stations[2].latLng.lng + ',' + stations[2].latLng.lat + '.json?access_token=' + mapboxAccessToken, function(json) {
                        directions.push(json);

                        var latLngsArray = [];
                        d3.range(0,3).forEach(function(i) {
                            var latLngs = [];
                            directions[i].routes[0].geometry.coordinates.forEach(function(coordinate) {
                                latLngs.push(L.latLng(coordinate[1], coordinate[0]));
                            });
                            latLngsArray.push(latLngs);
                        });

                        var multiPolyline = L.multiPolyline(latLngsArray, {color: 'red'}).addTo(map);
                        map.fitBounds(multiPolyline.getBounds());
                    });
                });
            });
        });
    });

    var processStation = function(station, a) {
        if (station.abbr === 'LAKE' || station.abbr === '19TH') {
            if (Object.prototype.toString.call(station.etd) === '[object Array]') {
                station.etd.forEach(function(etd) {
                   processEtd(station, etd, a);
                });
            } else {
                processEtd(station, station.etd, a);
            }
        }
    };

    var processEtd = function(station, etd, a) {
        if (etd.abbreviation === 'DALY' || etd.abbreviation === 'MLBR' || etd.abbreviation === 'SFIA') {
            if (Object.prototype.toString.call(etd.estimate) === '[object Array]') {
                etd.estimate.forEach(function(estimate) {
                    processEstimate(station, etd, estimate, a);
                });
            } else {
                processEstimate(station, etd, etd.estimate, a);
            }
        }
    };

    var processEstimate = function(station, etd, estimate, a) {
        if (estimate.minutes === 'Leaving') { estimate.minutes = 0; }

        a.push({
            station: station.name,
            destination: etd.destination,
            color: estimate.color,
            length: +estimate.length,
            minutes: +estimate.minutes
        });
    };
})();
