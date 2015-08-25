/**
 * Created by dp on 7/15/15.
 *
 *      Copyright 2015 Daniele Pignedoli <daniele.pignedoli@gmail.com>
 *
 *      @license http://www.gnu.org/licenses/gpl.html
 *      This program is free software; you can redistribute it and/or modify
 *      it under the terms of the GNU General Public License as published by
 *      the Free Software Foundation; either version 2 of the License, or
 *      (at your option) any later version
 *
 *      This program is distributed in the hope that it will be useful,
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of
 *      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *      GNU General Public License for more details: http://www.gnu.org/licenses/gpl.html
 *
 *      You should have received a copy of the GNU General Public License
 *      along with this program; if not, write to the Free Software
 *      Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 *      MA 02110-1301, USA
 */

(function ($) {
    $(document).ready(function () {
        console.log('Ready i am.');
        map = L.map('map')
            .addEventListener('mousemove',function (e) {
                jQuery("#log").html(e.latlng.lat + ' ' + e.latlng.lng + ' z: ' + map.getZoom());
            }).addEventListener('click', function (e) {
                var latlng = e.latlng;
                jQuery("#zoom").val(map.getZoom());
                jQuery("#lat").val(latlng.lat);
                jQuery("#lng").val(latlng.lng);
            });
        story = new JsPhotoStory(map);
        layer = L.featureGroup();

        // CREO LA MAPPA
        jQuery("#action1").click(function () {
            console.log('Create map..');
            map.setView([50.505, 30.50], 13);


            /*
             L.tileLayer.provider(
             'MapBox',
             {
             id: 'strae.mo9g38f5',
             accessToken: 'sk.eyJ1Ijoic3RyYWUiLCJhIjoiNDc0OWVlMmU4ZDQyMjRhY2NjMmE0NDI3NTlmY2IxYWIifQ.V9XczAbghUmTOkYwgcePig'
             }
             ).addTo(map);
             */


            L.tileLayer(
                'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {
                    attribution: 'Mapbox data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
                    maxZoom: 18
                }).addTo(map);


            L.circle([50.505, 30.57], 200).addTo(map);
        });

        // AGIUNGO I DUE MARKER IMMAGINI
        jQuery("#action2").click(function () {
            console.log('Add image markers..');
            marker = L.marker(
                [50.505, 30.50],
                {
                    icon: L.icon({
                        iconUrl: 'images/demo.jpg',
                        //iconRetinaUrl: 'my-icon@2x.png',
                        iconSize: [100, 100],
                        iconAnchor: [50, 50],
                        popupAnchor: [0, -50],
                        shadowUrl: 'images/demo3.png',
                        //shadowRetinaUrl: 'my-icon-shadow@2x.png',
                        shadowSize: [100, 100],
                        shadowAnchor: [47, 47]
                    })
                }
            );
            marker.addTo(map);

            marker2 = L.marker(
                [50.506, 30.65],
                {
                    icon: L.icon({
                        iconUrl: 'images/demo2.jpg',
                        //iconRetinaUrl: 'my-icon@2x.png',
                        iconSize: [100, 100],
                        iconAnchor: [50, 50],
                        popupAnchor: [0, -50],
                        shadowUrl: 'images/demo3.png',
                        //shadowRetinaUrl: 'my-icon-shadow@2x.png',
                        shadowSize: [100, 100],
                        shadowAnchor: [47, 47]
                    })
                }
            );
            marker2.addTo(map);
        });

        // CREO L'ARCO
        jQuery("#action3").click(function () {
            console.log('Create arc!');
            var generator = new arc.GreatCircle(
                {x: 50.505, y: 30.50},
                {x: 50.506, y: 30.65},
                {}
            );
            var line = generator.Arc(1000, {offset: 10});
            points = line.json();

            var poly = L.polyline(
                points.geometry.coordinates,
                {
                    color: '#000',
                    weight: 2,
                    dashArray: [5, 6]
                }
            );
            poly.addTo(map);
        });

        // VADO DALLA BIONDA
        jQuery("#action4").click(function () {
            console.log('Vado da 50.505, 30.50');
            map.panTo([50.505, 30.50]);
        });

        // VADO DALLA CINESE
        jQuery("#action5").click(function () {
            console.log('set zoom to', jQuery("#offset").val());
            map.setZoom(jQuery("#offset").val());
            //console.log('Ora invece da 50.506, 30.65');
            //map.panTo([50.506, 30.65]);
        });

        // AGGIUNGO IMMAGINI STRAMITE CLASSE STORY
        jQuery("#action6").click(function () {
            console.log('Addo immagini..');
            for (var i = 1; i < 4; i++) {
                story.addPhoto({url: 'images/' + i + '.jpg'});
            }
            console.log('State now..', ':' + story._state.toString(), story._processedPhotos);
            story.readExif(function () {
                story.printPhoto();
                var images = story.groupPhotos();
                var bounds = images.getBounds();
                //map.setMaxBounds(bounds);
                images.addTo(map);
                map.fitBounds(bounds);
            });
        });

        jQuery("#action13").click(function () {
            story.getMap().setView([jQuery("#lat").val(), jQuery("#lng").val()], jQuery("#zoom").val());
        });

        // RAGGRUPPO LE IMMAGINI
        jQuery("#action7").click(function () {
            //console.log('Aggiungo clicckete..');
            //story.setPhotoClick();
        });

        // Setto le routes
        jQuery("#action8").click(function () {
            console.log('Routes!');
            var r1 = new JsPhotoRouteSimple(
                'aviator',
                {
                    targets: ['1.jpg', '2.jpg'],
                    type: 'simple'
                }
            );
            var r2 = new JsPhotoRouteSimple(
                'aviator2',
                {
                    targets: ['2.jpg', '3.jpg'],
                    type: 'simple'
                    /*
                    before: function (route, story, photoFrom, photoTo) {
                        // calculate zoom required to include both photos in the map view
                        var bz = story.getMap().getBoundsZoom(
                            L.featureGroup([photoFrom.marker, photoTo.marker]).getBounds()
                        );
                        if (bz != story.getMap().getZoom()) {
                            story.getMap().addOneTimeEventListener('zoomend', function () {
                                story.getMap().panTo(
                                    photoTo.marker.getLatLng(),
                                    {
                                        duration: 2,
                                        animate: true,
                                        easeLinearity: 1
                                    }
                                );
                            });
                            story.getMap().setZoom(bz, {animate: true});
                        } else {
                            story.getMap().panTo(
                                photoTo.marker.getLatLng(),
                                {
                                    duration: 2,
                                    animate: true,
                                    easeLinearity: 1
                                }
                            );
                        }
                    },
                    after: function (route, story, photoFrom, photoTo) {
                        console.log('BODIBIDIBIDIDO');
                        story.getMap().setZoom(13);
                    }
                    */
                }
            );

            var r3 = new JsPhotoRouteSimple(
                'triangle',
                {
                    targets: ['1.jpg', '3.jpg'],
                    type: 'simple'
                }
            );

            story.addRoutes([r1, r2, r3]);


            jQuery("#action9").click(function () {
                story.getPhoto('1.jpg').ride();
            });

            jQuery("#action10").click(function () {
                story.getPhoto('2.jpg').ride('aviator2');
            });
            jQuery("#action11").click(function () {
                story.getPhoto('3.jpg').ride('triangle');
            });
            jQuery("#action12").click(function () {
                story.getPhoto('2.jpg').ride();
            });


            //story.printPhoto();
        });

        jQuery('#action14').click(function () {
            console.log('GOOOTOTOTOO');
            window.lng = -44;
            window.zoom = 10;
            window.cippa = setInterval(
                matsuka,
                10
            );
            window.cippa2 = setInterval(
                matsuka2,
                30
            );
        });

        jQuery('#action17').click(function () {
            JsPhotoShapes.curveSimple();
        });

    });
})(jQuery);
window.i = 0;
function matsuka() {
    if (window.lng > -48) {
        window.lng -= 0.05;
        map.setView([-20, lng], 10, {animate: false});
    } else {
        clearInterval(window.cippa);
    }
}
function matsuka2() {
    if (window.zoom < 13) {
        window.zoom += 1;
        map.setZoom(window.zoom, {animate: false});
    } else {
        clearInterval(window.cippa2);
    }
}


function move(map, points, current, end) {
    //console.log('Move to ', points[current]);
    map.setView(points[current], 13);
    current += 1;
    if (current < end) {
        setTimeout(function () {
            move(map, points, current, end);
        }, 20);
    }
}