var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget", "esri/Graphic", "esri/geometry/geometryEngine"], function (require, exports, __extends, __decorate, decorators_1, Widget_1, widget_1, Graphic_1, geometryEngine_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Widget_1 = __importDefault(Widget_1);
    Graphic_1 = __importDefault(Graphic_1);
    geometryEngine_1 = __importDefault(geometryEngine_1);
    var CSS = {
        base: "esri-hello-world",
        emphasis: "esri-hello-world--emphasis",
        button: "esri-sketch__button",
        selectedButton: "esri-sketch__button--selected",
        cursorIcon: "esri-icon-cursor",
        unionIcon: "esri-icon-pie-chart",
        clearIcon: "esri-icon-trash",
        noFlex: "no-flex",
        active: "active"
    };
    var GeometryWidget = /** @class */ (function (_super) {
        __extends(GeometryWidget, _super);
        function GeometryWidget(view) {
            var _this = _super.call(this) || this;
            _this.selectionEnabled = false;
            _this.highlightedFeatures = [];
            _this.highlightHandles = [];
            _this.view = view;
            return _this;
        }
        GeometryWidget.prototype.setSelectionTarget = function (layer) {
            this.selectionTargetLayer = layer;
        };
        GeometryWidget.prototype.setEditLayer = function (layer) {
            this.editLayer = layer;
        };
        GeometryWidget.prototype.setLayerView = function (layerView) {
            this.layerView = layerView;
        };
        GeometryWidget.prototype.toggleSelectMode = function () {
            var _this = this;
            this.selectionEnabled = !this.selectionEnabled;
            if (this.selectionEnabled) {
                this.highlightClickHandler = this.view.on("click", function (event) {
                    if (_this.selectionTargetLayer) {
                        var query = _this.selectionTargetLayer.createQuery();
                        query.geometry = event.mapPoint;
                        query.distance = 100;
                        query.units = "meters";
                        query.spatialRelationship = "intersects"; // this is the default
                        query.returnGeometry = true;
                        query.outFields = ["*"];
                        _this.selectionTargetLayer.queryFeatures(query)
                            .then(function (response) {
                            var _a;
                            _this.highlightHandles.push(_this.layerView.highlight(response.features));
                            (_a = _this.highlightedFeatures).push.apply(_a, response.features);
                        });
                    }
                    else {
                        console.error("GeometryWidget: No target FeatureLayer set.");
                    }
                });
            }
            else {
                this.highlightClickHandler.remove();
            }
        };
        GeometryWidget.prototype.unifySelectedFeatures = function () {
            var geometries = this.highlightedFeatures.map(function (feature) {
                return feature.geometry;
            });
            var union = geometryEngine_1.default.union(geometries);
            if (this.editLayer) {
                this.editLayer.applyEdits({
                    addFeatures: [new Graphic_1.default({
                            geometry: union
                        })]
                });
            }
            else {
                console.warn("GeometryWidget: No GraphicsLayer set to display unified geometry.", union);
            }
        };
        GeometryWidget.prototype.clearSelectedFeatures = function () {
            this.highlightedFeatures = [];
            this.highlightHandles.map(function (handle) { handle.remove(); });
        };
        GeometryWidget.prototype.renderSelectButton = function () {
            var title = "Select";
            var classes = [CSS.button, CSS.cursorIcon, CSS.noFlex];
            if (this.selectionEnabled) {
                classes.push(CSS.active);
            }
            return (widget_1.tsx("button", { bind: this, class: this.classes(classes), onclick: this.toggleSelectMode, title: title }));
        };
        GeometryWidget.prototype.renderUnionButton = function () {
            var title = "Union";
            var classes = [CSS.button, CSS.unionIcon, CSS.noFlex];
            return (widget_1.tsx("button", { bind: this, class: this.classes(classes), onclick: this.unifySelectedFeatures, title: title }));
        };
        GeometryWidget.prototype.renderClearButton = function () {
            var title = "Clear";
            var classes = [CSS.button, CSS.clearIcon, CSS.noFlex];
            return (widget_1.tsx("button", { bind: this, class: this.classes(classes), onclick: this.clearSelectedFeatures, title: title }));
        };
        GeometryWidget.prototype.render = function () {
            var view = this.view.type === "2d" ? this.view : this.view;
            return (widget_1.tsx("div", { class: "bwPopup" },
                this.renderSelectButton(),
                this.renderUnionButton(),
                this.renderClearButton()));
        };
        __decorate([
            widget_1.renderable(),
            decorators_1.property()
        ], GeometryWidget.prototype, "view", void 0);
        GeometryWidget = __decorate([
            decorators_1.subclass("esri.widgets.GeometryWidget")
        ], GeometryWidget);
        return GeometryWidget;
    }(decorators_1.declared(Widget_1.default)));
    exports.default = GeometryWidget;
});
//# sourceMappingURL=GeometryWidget.js.map