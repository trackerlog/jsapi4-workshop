var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/LayerList", "esri/widgets/Compass", "esri/widgets/ScaleRangeSlider", "esri/widgets/Search", "esri/views/SceneView", "./WatchWidget", "./GeometryWidget", "esri/layers/GraphicsLayer", "esri/widgets/Sketch", "esri/widgets/Editor"], function (require, exports, Map_1, MapView_1, FeatureLayer_1, LayerList_1, Compass_1, ScaleRangeSlider_1, Search_1, SceneView_1, WatchWidget_1, GeometryWidget_1, GraphicsLayer_1, Sketch_1, Editor_1) {
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
    GeometryWidget_1 = __importDefault(GeometryWidget_1);
    GraphicsLayer_1 = __importDefault(GraphicsLayer_1);
    Sketch_1 = __importDefault(Sketch_1);
    Editor_1 = __importDefault(Editor_1);
    var LearnJsapi4App = /** @class */ (function () {
        function LearnJsapi4App() {
            this.initializeMap();
            this.addWeinLayer();
            this.addFotoLayer();
            this.addEditLayer();
            this.sketchLayer = this.initNewGraphicsLayer("sketchLayer", "Sketch Layer");
            this.mapView = this.viewFactory(MapView_1.default, "mapDiv");
            this.sceneView = this.viewFactory(SceneView_1.default, "sceneDiv");
            this.addCenterWatch(this.mapView, this.sceneView);
        }
        LearnJsapi4App.prototype.addCenterWatch = function (watchView, setCenterView) {
            var _this = this;
            var watchHandle = watchView.watch("stationary", function (s) {
                if (s) {
                    setCenterView.watch("center", function (c) {
                        _this.mapView.center = c;
                    });
                    watchHandle.remove();
                }
            });
        };
        LearnJsapi4App.prototype.initializeMap = function () {
            this.map = new Map_1.default({
                basemap: "gray-vector"
            });
        };
        LearnJsapi4App.prototype.initNewGraphicsLayer = function (id, title) {
            var gl = new GraphicsLayer_1.default({
                id: id,
                title: title
            });
            return gl;
        };
        LearnJsapi4App.prototype.viewFactory = function (view, containerDiv) {
            var _this = this;
            var initView = new view({
                map: this.map,
                container: containerDiv
            });
            initView.when(function () {
                _this.addWidgets(initView);
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
        LearnJsapi4App.prototype.addEditLayer = function () {
            this.editLayer = new FeatureLayer_1.default({
                url: "https://services.arcgis.com/OLiydejKCZTGhvWg/arcgis/rest/services/jsapi4_Workshop_Editierlayer/FeatureServer/0"
            });
            this.map.add(this.editLayer);
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
                                caption: "{Stadtbezirk}",
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
            var _this = this;
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
            view.ui.add(scaleRangeSlider, {
                position: "top-left",
                index: 0
            });
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
            var editor = new Editor_1.default({
                view: view
            });
            view.ui.add(editor, {
                position: "top-right",
                index: 2
            });
            var sketch = new Sketch_1.default({
                layer: this.sketchLayer,
                view: view
            });
            // Listen to sketch widget's create event.
            sketch.on("create", function (event) {
                if (event.state === "complete") {
                    if (event.graphic.geometry.type === "polygon") {
                        _this.editLayer.applyEdits({
                            addFeatures: [event.graphic]
                        });
                        _this.sketchLayer.remove(event.graphic);
                    }
                }
            });
            view.ui.add(sketch, {
                position: "top-right",
                index: 1
            });
            var geometryWidget = new GeometryWidget_1.default(view);
            geometryWidget.setSelectionTarget(this.weinLayer);
            geometryWidget.setEditLayer(this.editLayer);
            view.whenLayerView(this.weinLayer).then(function (layerView) {
                geometryWidget.setLayerView(layerView);
            });
            view.ui.add(geometryWidget, {
                position: "top-right",
                index: 3
            });
            var watchWidget = new WatchWidget_1.default(view);
            view.ui.add(watchWidget, {
                position: "bottom-left",
                index: 0
            });
        };
        return LearnJsapi4App;
    }());
    var app = new LearnJsapi4App();
});
//# sourceMappingURL=main.js.map