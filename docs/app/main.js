var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/LayerList", "esri/widgets/Compass", "esri/widgets/ScaleRangeSlider", "esri/widgets/Search", "esri/views/SceneView", "./WatchWidget"], function (require, exports, Map_1, MapView_1, FeatureLayer_1, LayerList_1, Compass_1, ScaleRangeSlider_1, Search_1, SceneView_1, WatchWidget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Map_1 = __importDefault(Map_1);
    MapView_1 = __importDefault(MapView_1);
    FeatureLayer_1 = __importDefault(FeatureLayer_1);
    LayerList_1 = __importDefault(LayerList_1);
    Compass_1 = __importDefault(Compass_1);
    ScaleRangeSlider_1 = __importDefault(ScaleRangeSlider_1);
    Search_1 = __importDefault(Search_1);
    SceneView_1 = __importDefault(SceneView_1);
    WatchWidget_1 = __importDefault(WatchWidget_1);
    var LearnJsapi4App = /** @class */ (function () {
        function LearnJsapi4App() {
            this.initializeMap();
            this.addWeinLayer();
            this.addFotoLayer();
            this.mapView = this.viewFactory(MapView_1.default, "mapDiv");
            this.sceneView = this.viewFactory(SceneView_1.default, "sceneDiv");
            this.addCenterWatch(this.sceneView, this.sceneView);
        }
        LearnJsapi4App.prototype.addCenterWatch = function (watchView, setCenterView) {
            var _this = this;
            var firsttime = true;
            watchView.watch("stationary", function (s) {
                if (s && firsttime) {
                    firsttime = false;
                    setCenterView.watch("center", function (c) {
                        _this.mapView.center = c;
                    });
                }
            });
        };
        LearnJsapi4App.prototype.initializeMap = function () {
            this.map = new Map_1.default({
                basemap: "gray-vector"
            });
        };
        LearnJsapi4App.prototype.viewFactory = function (view, containerDiv) {
            var _this = this;
            var initView = new view({
                map: this.map,
                container: containerDiv,
                center: [-118.244, 34.052],
                zoom: 3
            });
            this.addWidgets(initView);
            initView.when(function () {
                _this.weinLayer.queryExtent(_this.weinQuery).then(function (result) {
                    initView.goTo(result.extent, {
                        animate: true,
                        duration: 10000,
                        easing: "ease-out"
                    });
                });
            });
            return initView;
        };
        LearnJsapi4App.prototype.addWeinLayer = function () {
            this.weinLayer = new FeatureLayer_1.default({
                url: "http://services.arcgis.com/OLiydejKCZTGhvWg/arcgis/rest/services/WeinanbauGebiete/FeatureServer/0"
            });
            this.map.add(this.weinLayer);
            this.weinQuery = this.weinLayer.createQuery();
            this.weinQuery.where = "1=1";
            this.weinQuery.outFields = ["*"];
        };
        LearnJsapi4App.prototype.addFotoLayer = function () {
            var template = {
                // autocasts as new PopupTemplate()
                title: "{Titel_Hotel_Sehenswürdigkeit_L} in {Stadtbezirk}",
                content: [
                    {
                        // It is also possible to set the fieldInfos outside of the content
                        // directly in the popupTemplate. If no fieldInfos is specifically set
                        // in the content, it defaults to whatever may be set within the popupTemplate.
                        type: "fields",
                        fieldInfos: [
                            {
                                fieldName: "Adresse_Straße_Hausnummer",
                                label: "Adresse"
                            },
                            {
                                fieldName: "Postleitzahl",
                                label: "PLZ"
                            }
                        ]
                    },
                    {
                        type: "media",
                        mediaInfos: [{
                                title: "{Titel_Hotel_Sehenswürdigkeit_L}",
                                type: "image",
                                caption: "{Titel_Hotel_Sehenswürdigkeit_L}",
                                // Autocasts as new ImageMediaInfoValue()
                                value: {
                                    sourceURL: "{BildURL}"
                                }
                            }]
                    }
                ]
            };
            this.fotoLayer = new FeatureLayer_1.default({
                url: "http://services.arcgis.com/OLiydejKCZTGhvWg/arcgis/rest/services/Sehenswuerdigkeiten_POIs_3/FeatureServer/0",
                popupTemplate: template
            });
            this.map.add(this.fotoLayer);
        };
        LearnJsapi4App.prototype.addWidgets = function (view) {
            var layerList = new LayerList_1.default({
                view: view
            });
            view.ui.add(layerList, {
                position: "bottom-right",
                index: 0
            });
            if (view.type == "2d") {
                var compass = new Compass_1.default({
                    view: view
                });
                view.ui.add(compass, "top-left");
            }
            var scaleRangeSlider = new ScaleRangeSlider_1.default({
                view: view,
                layer: this.weinLayer,
                region: "DE"
            });
            view.ui.add(scaleRangeSlider, "bottom-left");
            scaleRangeSlider.watch(["minScale", "maxScale"], function (value, oldValue, name) {
                this.weinLayer[name] = value;
            });
            var searchWidget = new Search_1.default({
                view: view
            });
            view.ui.add(searchWidget, {
                position: "top-right",
                index: 0
            });
            // Custom Widget
            var watchWidget = new WatchWidget_1.default(view);
            view.ui.add(watchWidget, {
                position: "top-right",
                index: 1
            });
        };
        return LearnJsapi4App;
    }());
    var app = new LearnJsapi4App();
});
//# sourceMappingURL=main.js.map