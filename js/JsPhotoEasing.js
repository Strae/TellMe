/**
 * Created by dp on 7/18/15.
 *
 *      Copyright 2015 Daniele Pignedoli <daniele.pignedoli@gmail.com>
 *
 *      @source https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
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

JsPhotoEasing = function () {
};
JsPhotoEasing.easeOutCubic = function (t, b, c, d) {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
};
JsPhotoEasing.linear = function (t, b, c, d) {
    return c * t / d + b;
};

JsPhotoEasing.easeInQuad = function (t, b, c, d) {
    return c * (t /= d) * t + b;
};
JsPhotoEasing.easeOutQuad = function (t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
};
JsPhotoEasing.easeInOutQuad = function (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
};
JsPhotoEasing.easeInCubic = function (t, b, c, d) {
    return c * (t /= d) * t * t + b;
};
JsPhotoEasing.easeInOutCubic = function (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
};
JsPhotoEasing.easeInQuart = function (t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
};
JsPhotoEasing.easeOutQuart = function (t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
};
JsPhotoEasing.easeInOutQuart = function (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
};
JsPhotoEasing.easeInQuint = function (t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
};
JsPhotoEasing.easeOutQuint = function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
};
JsPhotoEasing.easeInOutQuint = function (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
};
JsPhotoEasing.easeInSine = function (t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
};
JsPhotoEasing.easeOutSine = function (t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
};
JsPhotoEasing.easeInOutSine = function (t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
};
JsPhotoEasing.easeInExpo = function (t, b, c, d) {
    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
};
JsPhotoEasing.easeOutExpo = function (t, b, c, d) {
    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
};
JsPhotoEasing.easeInOutExpo = function (t, b, c, d) {
    if (t == 0) return b;
    if (t == d) return b + c;
    if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
};
JsPhotoEasing.easeInCirc = function (t, b, c, d) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
};
JsPhotoEasing.easeOutCirc = function (t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
};
JsPhotoEasing.easeInOutCirc = function (t, b, c, d) {
    if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
};
JsPhotoEasing.easeInElastic = function (t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * .3;
    if (a < Math.abs(c)) {
        a = c;
        var s = p / 4;
    }
    else var s = p / (2 * Math.PI) * Math.asin(c / a);
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
};
JsPhotoEasing.easeOutElastic = function (t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * .3;
    if (a < Math.abs(c)) {
        a = c;
        var s = p / 4;
    }
    else var s = p / (2 * Math.PI) * Math.asin(c / a);
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
};
JsPhotoEasing.easeInOutElastic = function (t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d / 2) == 2) return b + c;
    if (!p) p = d * (.3 * 1.5);
    if (a < Math.abs(c)) {
        a = c;
        var s = p / 4;
    }
    else var s = p / (2 * Math.PI) * Math.asin(c / a);
    if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
};
JsPhotoEasing.easeInBack = function (t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
};
JsPhotoEasing.easeOutBack = function (t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
};
JsPhotoEasing.easeInOutBack = function (t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
};
JsPhotoEasing.easeInBounce = function (t, b, c, d) {
    return c - JsPhotoEasing.easeOutBounce(d - t, 0, c, d) + b;
};
JsPhotoEasing.easeOutBounce = function (t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
    } else if (t < (2 / 2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
    } else if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
    } else {
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
    }
};
JsPhotoEasing.easeInOutBounce = function (t, b, c, d) {
    if (t < d / 2) return JsPhotoEasing.easeInBounce(t * 2, 0, c, d) * .5 + b;
    return JsPhotoEasing.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
};