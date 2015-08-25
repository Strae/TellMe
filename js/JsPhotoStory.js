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

/**
 *
 */

JsPhoto = function (img, name) {
    this.image = img;
    this.defaultRoute = false;
    this.name = name || img.src.substring(
        img.src.lastIndexOf('/') + 1,
        img.src.length
    );

    this.routes = {};

    this.ride = function (name) {
        var route = name || this.defaultRoute;
        this.routes[route].ride(this);
    };

    this.addRoute = function (route) {
        if (false === this.defaultRoute) {
            this.defaultRoute = route.name;
        }
        this.routes[route.name] = route;
    };

    this.setDefaultRoute = function (name) {
        this.defaultRoute = name;
    };
};

JsPhotoStory = function (the_map) {
    this.map = the_map || map;
    this._numPhotos = 0;
    this._photos = [];
    this._state = 'idle';
    this._processedPhotos = 0;

    /**
     * Add a photo to the story.
     * @param params mixed array with keys:
     * url Url of the image
     * name (optional) if not given, filename will be used
     */
    this.addPhoto = function (params) {
        params = params || {};
        if ('undefined' != typeof params.url) {
            var img = new Image();
            img.src = params.url;
            var photo = new JsPhoto(img);
        }

        if ('undefined' != typeof photo) {
            photo.story = this;
            this._photos[photo.name] = photo;
            this._numPhotos += 1;
        } else {
            // throw error
        }
    };

    /**
     * Read all the exif from all the images and inject the useful data into the
     * image container.
     * @param callback
     * @returns {*}
     */
    this.readExif = function (callback) {
        if ('idle' === this._state) {
            this._state = 'busy';
            for (i in this._photos) {
                (function (img, index) {
                    EXIF.getData(img.image, function () {
                        var data = EXIF.getAllTags(this);
                        if ('undefined' != typeof data.GPSLatitude) {
                            if (img.name == '2.jpg') {

                                img.story.setPhotoExif(
                                    {
                                        coordinates: [-23.101228694444448, -44.39362288888889],
                                        dateTime: data.DateTime,
                                        width: data.PixelYDimension,
                                        height: data.PixelXDimension
                                    },
                                    index
                                );
                            } else {
                                img.story.setPhotoExif(
                                    {
                                        coordinates: [
                                            coords.fromSexagesimalRaw(
                                                data.GPSLatitude[0],
                                                data.GPSLatitude[1],
                                                data.GPSLatitude[2],
                                                data.GPSLatitudeRef
                                            ),
                                            coords.fromSexagesimalRaw(
                                                data.GPSLongitude[0],
                                                data.GPSLongitude[1],
                                                data.GPSLongitude[2],
                                                data.GPSLongitudeRef
                                            )
                                        ],
                                        dateTime: data.DateTime,
                                        width: data.PixelYDimension,
                                        height: data.PixelXDimension
                                    },
                                    index
                                );
                            }
                        }
                    });
                })(this._photos[i], i);
            }
            if (this._numPhotos !== this._processedPhotos) {
                var story = this;
                setTimeout(
                    function () {
                        story.readExif(callback);
                    },
                    1
                );
            } else {
                this._state = 'done';
                return callback();
            }
        } else if ('busy' === this._state) {
            if (this._processedPhotos < this._numPhotos) {
                var story = this;
                setTimeout(
                    function () {
                        story.readExif(callback);
                    },
                    1
                );
            } else {
                this._state = 'done';
                return callback();
            }
        }
    };

    /**
     * Set the attributes.
     * @param data
     * @param index
     */
    this.setPhotoExif = function (data, index) {
        for (k in data) {
            this._photos[index][k] = data[k];
        }
        console.log(this._photos[index].name, this._photos[index].coordinates);
        this._processedPhotos += 1;
    };

    /**
     * Create the layer that will contain all the photos.
     * @returns {*}
     */
    this.groupPhotos = function () {
        var container = L.featureGroup();
        for (i in this._photos) {
            var photo = this._photos[i];
            (function (photo, container, map) {
                var marker = L.marker(
                    [
                        photo.coordinates[0],
                        photo.coordinates[1]
                    ],
                    {
                        /*
                         icon: L.icon({
                         iconUrl: photo.image.src,
                         //iconRetinaUrl: 'my-icon@2x.png',
                         iconSize: [100, 100],
                         iconAnchor: [50, 50],
                         popupAnchor: [0, -50]
                         //shadowUrl: 'images/demo3.png',
                         //shadowRetinaUrl: 'my-icon-shadow@2x.png',
                         //shadowSize: [100, 100],
                         //shadowAnchor: [47, 47]
                         })
                         */
                    }
                );
                marker.bindPopup('<h3>'+ photo.name +'</h3>');
                photo.marker = marker;
                container.addLayer(marker);
            })(photo, container, map);
        }
        return container;
    };

    /**
     * Set the click callback to a photo.
     * @param name
     * @param callback
     */
    this.setPhotoClick = function (name, callback) {
        var photo = this._photos[name];
        photo.marker.addEventListener(
            'click',
            function () {
                callback(photo);
            }
        );
    };

    this.addRoutes = function (routes) {
        for (r in routes) {
            routes[r]._story = this;
            for (p in this._photos) {
                if (routes[r].targets[0] === p || routes[r].targets[1] === p) {
                    this._photos[p].addRoute(routes[r]);
                }
            }
        }
    };

    this.getMap = function () {
        return this.map;
    };
    this.getPhoto = function (ident) {
        return this._photos[ident];
    };

    this.printPhoto = function () {
        console.log(this._photos);
    };

};


JsPhotoRoute = function (name, params) {
    this.name = name;
    this.targets = params.targets;
    this.type = params.type;
    this._story = null;
};

JsPhotoRouteSimple = function (name, params) {
    JsPhotoRoute.apply(this, arguments);
    this.duration = params.duration || 2;
    this.step = params.step || 100;
    this.lastPosition = null;
    this.before = params.before || null;
    this.after = params.after || null;
    this._path = false;
    this.sourceImg = false;

    this.ride = function (img) {
        this.sourceImg = img;
        var to = this.sourceImg.name == this.targets[0] ? this.targets[1] : this.targets[0];
        var from = this.sourceImg.name == this.targets[0] ? this.targets[0] : this.targets[1];
        console.warn('Going from', from, '..to', to);
        if (false === this._path) {
            this.drawPath(
                this._story,
                this._story.getPhoto(from).marker.getLatLng(),
                this._story.getPhoto(to).marker.getLatLng(),
                from,
                to
            );
        }

        if (this.before) {
            this.before(
                this,
                this._story,
                this._story.getPhoto(from),
                this._story.getPhoto(to)
            );
        } else {
            this._story.getMap().panTo(
                this._story.getPhoto(to).marker.getLatLng(),
                {
                    duration: this.duration,
                    animate: true
                }
            );
            if (this.after) {
                this.after(
                    this,
                    this._story,
                    this._story.getPhoto(from),
                    this._story.getPhoto(to)
                );
            }
        }


        /*
         // This version try to draw the polyline starting from the map center!
         var to = img.name == this.targets[0] ? this.targets[1] : this.targets[0];
         var from = img.name == this.targets[1] ? this.targets[0] : this.targets[1];
         this.lastPosition = story.getPhoto(from).marker.getLatLng();
         this._path = L.polyline(
         this.lastPosition,
         {
         color: '#333',
         weight: 3,
         dashArray: [5, 6]
         }
         ).addTo(story.getMap());

         story.getMap()
         .on('move', this.eventMapMoveListener, this)
         .on('moveend', function () {
         story.getMap().off('move', this.eventMapMoveListener, this);
         },
         this
         ).panTo(story.getPhoto(to).marker.getLatLng());
         */
    };

    this.drawPath = function (story, from, to, fromname, toname) {
        this._path = L.polyline(
            from,
            {
                color: '#333',
                weight: 3,
                dashArray: [5, 6]
            }
        ).addLatLng([from.lat, from.lng]).addTo(story.getMap());
        var m = {
            step: this.step,
            duration: this.duration * 1000,
            time: 0,
            currInterval: false
        };

        (function (m, from, to, path, story) {
            m.currInterval = window.setInterval(function () {
                if (m.time > m.duration) {
                    window.clearInterval(m.currInterval);
                } else {
                    m.time += m.step;
                    var arcLatLng = JsPhotoShapes.curveSimple(m.time, from, to, m.duration, false);
                    //console.log(arcLatLng);
                    path.addLatLng(arcLatLng);
                }
            }, m.step);
        })(m, from, to, this._path, story);

    };

    // Draw a polyline.
    this.eventMapMoveListener = function (e) {
        var lastPosition = this.lastPosition;
        var center = e.target.getCenter();
        if (lastPosition.lat != center.lat || lastPosition.lng != center.lng) {
            this._path.addLatLng(center);
            this.lastPosition = center;
        }
    };
};

JsPhotoRouteSimple.prototype = JsPhotoRoute.prototype;














