/**
 *      Created in 7/19/15 12:34 AM
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
 *
 * */

JsPhotoShapes = function () {
};


JsPhotoShapes.curveSimple = function (time, from, to, duration, forceTop) {
    var p = (time / duration) * 100;
    var F = [((from.lat + to.lat) / 2), ((from.lng + to.lng) / 2)];
    var AFB = 180; // angolazione totale tra A, F e B
    var startAngle = (AFB / Math.PI * Math.atan2(from.lng - F[1], from.lat - F[0]));
    var endAngle = (AFB / Math.PI * Math.atan2(to.lng - F[1], to.lat - F[0]));

    var r = Math.sqrt(
        Math.pow(F[0] - from.lat, 2) + Math.pow(F[1] - from.lng, 2)
    );

    /*
     L.polyline([
     [from.lat, from.lng],
     [to.lat, to.lng]
     ], {color: '#f00'})
     .bindPopup(from.name + ' >> ' + to.name)
     .addTo(map);
     */


    var anglePoint = (startAngle + endAngle) / 2;
    var newRadial = Math.PI * (anglePoint / 180);

    if (false == forceTop) {
        var newPoint = [
            F[0] + (r * Math.cos(newRadial)),
            F[1] + (r * Math.sin(newRadial))
        ];
    } else {
        var newPoint = [
            F[0] - (r * Math.cos(newRadial)),
            F[1] - (r * Math.sin(newRadial))
        ];
    }

    var newR = Math.sqrt(
        Math.pow(newPoint[0] - from.lat, 2) + Math.pow(newPoint[1] - from.lng, 2)
    );

    /*
     L.polyline([F, newPoint], {color: '#0f0'})
     .bindPopup('F >> newPoint')
     .addTo(map);

     L.polyline([newPoint, [from.lat, from.lng]], {color: '#00F'})
     .bindPopup('newPoint >> ' + from.name)
     .addTo(map);

     L.polyline([newPoint, [to.lat, to.lng]], {color: '#00F'})
     .bindPopup('newPoint >> ' + to.name)
     .addTo(map);

     L.circle(from, 400, {color: '#00F', opacity: 1}).bindPopup('<h2>F, ' + from.name + ' >> ' + to.name + '</h2>').addTo(map);
     */

    //var tondo = L.polyline([], {color: '#333', weight: 2});
    for (var deg = 0; deg < 360; deg += 0.5) {
        var radial = Math.PI * (deg / 180);
        var x = newPoint[0] + (newR * Math.cos(radial));
        var y = newPoint[1] + (newR * Math.sin(radial));
        if (from.lat.toFixed(2) == x.toFixed(2) && from.lng.toFixed(2) == y.toFixed(2)) {
            var startAngleN = deg;
        }
        if (to.lat.toFixed(2) == x.toFixed(2) && to.lng.toFixed(2) == y.toFixed(2)) {
            var endAngleN = deg;
        }
        //tondo.addLatLng(new L.latLng([x, y]));
        //L.circle([x, y], 10, {color: '#333'}).bindPopup(ciupa + ', ' + from.name + ' >> ' + to.name).addTo(map);
    }
    //tondo.addTo(map);


    // Choose the shortest path
    if (startAngleN - endAngleN > endAngleN - startAngleN) {
        var NN = startAngleN;
        startAngleN = endAngleN;
        endAngleN = NN;
    }

    var diffAngle = endAngleN - startAngleN;
    var angleProgress = (diffAngle * p) / 100;

    if (angleProgress > diffAngle) {
        return [to.lat, to.lng];
    } else {
        if (startAngle > endAngle) {
            console.log('<<<<<', (startAngleN + angleProgress), diffAngle);
            var radial = Math.PI * ((startAngleN + angleProgress) / 180);
        } else {
            console.log('>>>>>', (endAngleN - angleProgress), diffAngle);
            var radial = Math.PI * ((endAngleN - angleProgress) / 180);
        }
        var x = newPoint[0] + (newR * Math.cos(radial));
        var y = newPoint[1] + (newR * Math.sin(radial));
        return [x, y];
    }
};

JsPhotoShapes._curveSimpleGet = function (p, from, to, focus, time) {
    /*
     var pAngle = ((p * AFB) / 100);
     if(pAngle >= AFB){
     return [to.lat, to.lng];
     }
     */
    /*
     var pAngle = time;

     var startAngle = 90;
     var endAngle = 90;
     var forceTop = true;

     if(startAngle > endAngle && true === forceTop){
     pAngle = startAngle - pAngle;
     } else {
     pAngle += startAngle;
     }

     var radial = Math.PI * (pAngle / 180);
     var x = F[0] + (r * Math.cos(radial));
     var y = F[1] + (r * Math.sin(radial));
     return [x, y];
     */
}










