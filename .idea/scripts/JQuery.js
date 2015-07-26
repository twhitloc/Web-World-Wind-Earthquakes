/**
 * Created by tylerwhitlock on 7/19/15.
 */

function eventWindowLoaded() {
    // Create a World Window for the canvas.
    var wwd = new WorldWind.WorldWindow("canvasOne");
    //array of layers to add
    var layers =
        [{layer: new WorldWind.BMNGLayer(), enabled: true}];
            //{layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            //{layer: new WorldWind.BingAerialWithLabelsLayer(), enabled: true},
            //{layer: new WorldWind.OpenStreetMapImageLayer(), enabled: true},
            //{layer: new WorldWind.CompassLayer(), enabled: true},
            //{layer: new WorldWind.CoordinatesDisplayLayer(), enabled: true},
            //{layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}];


    // Add some image layers to the World Window's globe.
    for (var i = 0; i < layers.length; i++) {
        layers[i].layer.enabled = layers[i].enabled;

        wwd.addLayer(layers[i].layer);
    }
    //var coord = new WorldWind.placePoint(80,180);
  /*/  var placemarkLayer = new WorldWind.RenderableLayer("Placemarks");
    var placemark = new WorldWind.Placemark(new WorldWind.Position(0.0, 0.0, 1e2));
    placemark.enabled = true;
    placemark.label = "glfsdfk";
    placemark.highlighted = true;
    placemark.alwaysOnTop = true;
    placemarkLayer.addRenderable(placemark);
    placemarkLayer.layer.enabled = placemarkLayer.enabled;
    wwd.addLayer(placemarkLayer);


    /*/
     createLayer(wwd);
     //wwd.addLayer(new WorldWind.CompassLayer());
     //wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
     // wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));
     // wwd.redraw();

     };


     /**
     * Created by tylerwhitlock on 7/21/15.
     */


    function createLayer(ww) {

        var EarthquakeLayer = function (worldWindow, name) {
            var wwd = worldWindow;
            var eLayer = new WorldWind.RenderableLayer(name); //creates the layer on which the earthquakes will be mapped
            var dContext = new worldWindow.drawContext;

            var placemark, highlightAttributes,
                placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

            var xmlhttp = new XMLHttpRequest();
            var url = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=500";
            // The earthquake data is retrieved from the above URL using HTTP get.
            var Array = [];


            var data = JSON.parse(xmlhttp.responseText);
            myFunction(data);
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
            function myFunction(data) {

                var earthquakes = data['features'];

                for (var i = 0; i < earthquakes.length; i++) {
                    var quake = earthquakes[i];
                    var geometry = quake['geometry'];
                    var logistics = quake['properties'];

                    var earthquake = {
                        magnitude: Number(logistics['mag']),
                        date_time: logistics['time'], 		// this variable contains time in millisecond since time 0 (1.1.1970)

                        depth: Number(geometry['coordinates'][2]),
                        latitude: Number(geometry['coordinates'][1]),
                        longitude: Number(geometry['coordinates'][0])
                    };

                    // How long ago the earthquake occurred in terms of days
                    earthquake.ageDay = Math.abs((new Date().getTime()) - new Date(earthquake.date_time).getTime()) /
                        (24 * 3600000);
                    //How long ago the earthquake occured in terms of hours
                    earthquake.ageHours = Math.floor(Math.abs((new Date().getTime() - new Date(earthquake.date_time).getTime())
                        / (3600000)));


                    Array.push(earthquake);

                }


            }

            var colorSpect = [[255, 0, 0], [0, 255, 0]];


            for (var i = 0; i < Array.length; i++) {
                // Create the custom image for the placemark for each earthquake.
                var canvas = document.createElement("canvas"),
                    ctx2d = canvas.getContext("2d"),
                    size = Array[i].magnitude * 5, c = size / 2 - 0.5, innerRadius = 0, outerRadius = Array[i].magnitude * 2.2;
                canvas.width = size;
                canvas.height = size;
                ctx2d.fillStyle =new WorldWind.Color(1, 1, 1, .55)
                //ctx2d.fillStyle = eLayer.Draw.GetColorSpectrum(Array[i].age / eLayer.Manage.Data[eLayer.Manage.Data.length - 1].age, colorSpect)



                ctx2d.arc(c, c, outerRadius, 0, 2 * Math.PI, false);
                ctx2d.fill();

                // Create the placemark.
                placemark = new WorldWind.Placemark(new WorldWind.Position(Array[i].latitude, Array[i].longitude, 1e2));
                placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

                // Create the placemark attributes for the placemark.
                placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                placemarkAttributes.imageScale = 1;
                placemarkAttributes.imageColor = new WorldWind.Color(1, 1, 1, .55)

                // Wrap the canvas created above in an ImageSource object to specify it as the placemark image source.
                placemarkAttributes.imageSource = new WorldWind.ImageSource(canvas);
                placemark.attributes = placemarkAttributes;
                // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
                // the default highlight attributes so that all properties are identical except the image scale. You could
                // instead vary the color, image, or other property to control the highlight representation.
                highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                highlightAttributes.imageScale = 1.2;
                highlightAttributes.imageSource = new WorldWind.ImageSource(canvas);
                placemark.highlightAttributes = highlightAttributes;

                // Add the placemark to the layer.
                eLayer.addRenderable(placemark);
            }
            eLayer.Manage = {

               

                //adds things to the layer
                Draw: {
                    //returns color based on the array and the fraction.
                    GetColorSpectrum: function (fraction, spectrumArrayColors, wwS) {
                        var format = (wwS === undefined) ? true : false;
                        //array looks like [[r,g,b],[r,g,b],...
                        var divisions = spectrumArrayColors.length - 1;
                        for (var i = 0; i < divisions; i++) {
                            if (fraction >= i / divisions && fraction <= (i + 1) / divisions) {
                                var r = spectrumArrayColors[i][0] + fraction * (spectrumArrayColors[i + 1][0] - spectrumArrayColors[i][0]),
                                    g = spectrumArrayColors[i][1] + fraction * (spectrumArrayColors[i + 1][1] - spectrumArrayColors[i][1]),
                                    b = spectrumArrayColors[i][2] + fraction * (spectrumArrayColors[i + 1][2] - spectrumArrayColors[i][2]);

                                if (format) {
                                    return "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")";
                                } else {
                                    return new WorldWind.Color(r / 255, g / 255, b / 255, 1)
                                }

                            }
                        }

                    },
                    //draws all the earthquakes in eLayer.Manage.ParsedData onto the layer
                    Placemarks: function () {
                        eLayer.Manage.Animations.canAnimate = true;
                        eLayer.Layer.clearLayer();
                        var placemark, highlightAttributes,
                            placemarkAttributes = new WorldWind.PlacemarkAttributes(null),
                            Array = eLayer.Manage.ParsedData;
                        var colorSpect = [[255, 0, 0], [0, 255, 0]];


                        //adds all the earthquakes as renderables to the layer
                        for (var i = 0; i < Array.length; i++) {
                            // Create the custom image for the placemark for each earthquake.
                            var canvas = document.createElement("canvas"),
                                ctx2d = canvas.getContext("2d"),
                                size = Array[i].magnitude * 5, c = size / 2 - 0.5, innerRadius = 0, outerRadius = Array[i].magnitude * 2.2;
                            canvas.width = size;
                            canvas.height = size;

                            ctx2d.fillStyle = eLayer.Manage.Draw.GetColorSpectrum(Array[i].age / eLayer.Manage.Data[eLayer.Manage.Data.length - 1].age, colorSpect)
                            ctx2d.arc(c, c, outerRadius, 0, 2 * Math.PI, false);
                            ctx2d.fill();

                            // Create the placemark.
                            placemark = new WorldWind.Placemark(new WorldWind.Position(Array[i].lat, Array[i].long, 1e2));
                            placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

                            // Create the placemark attributes for the placemark.
                            placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                            placemarkAttributes.imageScale = 1;
                            placemarkAttributes.imageColor = new WorldWind.Color(1, 1, 1, .55)

                            // Wrap the canvas created above in an ImageSource object to specify it as the placemark image source.
                            placemarkAttributes.imageSource = new WorldWind.ImageSource(canvas);
                            placemark.attributes = placemarkAttributes;
                            // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
                            // the default highlight attributes so that all properties are identical except the image scale. You could
                            // instead vary the color, image, or other property to control the highlight representation.
                            highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                            highlightAttributes.imageScale = 1.2;
                            highlightAttributes.imageSource = new WorldWind.ImageSource(canvas);
                            placemark.highlightAttributes = highlightAttributes;

                            // Add the placemark to the layer.
                            eLayer.addRenderable(placemark);
                        }
                        wwd.redraw();
                    }
                }
            }



            return eLayer
        }

            return EarthquakeLayer;

    }


    /**
     * Created by Matthew on 6/16/2015.
     */






















    define(['http://worldwindserver.net/webworldwind/worldwindlib.js',
            'http://worldwindserver.net/webworldwind/examples/LayerManager.js',
            'http://worldwindserver.net/webworldwind/examples/CoordinateController.js',
            'EarthquakeViewLayer'],
        function (ww,
                  LayerManager,
                  CoordinateController,
                  EarthquakeViewLayer) {
            "use strict";
            // Tell World Wind to log only warnings.
            WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

            // Create the World Window.


            //displays info of highlighted earthquake in eData division, also sets the significant earthquake when clicked
            /*/ var displayInfo = function (layer) {

             //location to display the info
             var display = $('#eData');

             //finds the highlighted renderable
             for (var i in layer.renderables) {

             if (layer.renderables[i].highlighted) {
             display.empty();
             display.append('<p>' + layer.Manage.ParsedData[i].info + '</p>');
             }

             }
             };
             /*/
            console.log('Loading USGS Data');
            var newLayer = new EarthquakeViewLayer(wwd, "Data Display");
            newLayer.Manage.setDisplayType('placemarks');

            //         var newColumns = new EarthquakeViewLayer(wwd, "Data Display Columns");
            //         newColumns.Manage.setDisplayType('columns');

            //uses the REST API available on the USGS website to retrieve
            //earthquake data from the last 30 days




            //waits for the data to be retrieved and parsed and then passes it to the earthquake layer.
            dataRetriever.retrieveRecords(function (arg) {
                console.log('Loaded');

                //passes the retrieved data to the layer
                newLayer.Manage.createDataArray(arg);

                wwd.addLayer(newLayer);
                newColumns.Manage.createDataArray(arg);
                wwd.addLayer(newColumns);
                newColumns.enabled = false

                var queryParamaterExtractor = new QueryParameterExtractor(queryParamsCallbacks);
                console.log(queryParamaterExtractor);
                console.log(queryParamaterExtractor.getParams());

                //parses and draws earthquakes on layer. Set minimum visible magnitude to the default value of the slider
                newLayer.Manage.parseDataArrayMag(magSlider.slider('getValue'));

                //animates most recent earthquake. the first renderable in the layer is the most recent earthquake
                newLayer.Manage.Animations.animate(newLayer.renderables[0]);
                console.log('quakes ', arg);


            });

            //crude implementation to display the info of the earthquake highlighted
            document.getElementById("canvasOne").onmousemove = function tss() {
                displayInfo(newLayer);
                displayInfo(newColumns);
            };

            // Create a layer manager for controlling layer visibility.
            var layerManager = new LayerManager(wwd);


            // Draw the World Window for the first time.
            wwd.redraw();

            // Create a coordinate controller to update the coordinate overlay elements.
            var coordinateController = new CoordinateController(wwd);

            //
            var highlightController = new WorldWind.HighlightController(wwd);


            /*
             The following code can be used to parse data form the server.
             This code is not in a module format, and thus must be pasted to the desired location
             */


        });



