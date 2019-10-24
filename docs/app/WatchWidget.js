/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
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
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget"], function (require, exports, __extends, __decorate, decorators_1, Widget_1, widget_1) {
    "use strict";
    Widget_1 = __importDefault(Widget_1);
    var CSS = {
        base: "esri-widget",
        specific: "watch-widget",
        emphasis: "watch-widget--emphasis"
    };
    var WatchWidget = /** @class */ (function (_super) {
        __extends(WatchWidget, _super);
        function WatchWidget(view) {
            var _this = _super.call(this) || this;
            _this.firstName = "John";
            _this.lastName = "Smith";
            _this.emphasized = false;
            _this.view = view;
            return _this;
        }
        // Public method
        WatchWidget.prototype.render = function () {
            var _a;
            var classes = (_a = {},
                _a[CSS.emphasis] = this.emphasized,
                _a);
            var viewSpecificProps;
            if (this.view.type == "2d") {
                if (this.view.extent) {
                    viewSpecificProps = widget_1.tsx("div", null,
                        widget_1.tsx("span", { class: CSS.emphasis }, "Extent Properties"),
                        widget_1.tsx("br", null),
                        widget_1.tsx("span", null,
                            "X left ",
                            this.view.extent.xmin.toFixed(2)),
                        widget_1.tsx("br", null),
                        widget_1.tsx("span", null,
                            "X right ",
                            this.view.extent.xmax.toFixed(2)),
                        widget_1.tsx("br", null),
                        widget_1.tsx("span", null,
                            "Y bottom ",
                            this.view.extent.ymin.toFixed(2)),
                        widget_1.tsx("br", null),
                        widget_1.tsx("span", null,
                            "Y top ",
                            this.view.extent.ymax.toFixed(2)),
                        widget_1.tsx("br", null),
                        widget_1.tsx("span", null,
                            "Rotation ",
                            this.view.rotation.toFixed(2)),
                        widget_1.tsx("br", null),
                        widget_1.tsx("span", null,
                            "Center ",
                            this.view.center.x.toFixed(2),
                            "/",
                            this.view.center.y.toFixed(2)));
                }
            }
            else if (this.view.type == "3d") {
                if (this.view.camera) {
                    viewSpecificProps = widget_1.tsx("div", null,
                        widget_1.tsx("span", { class: CSS.emphasis }, "Camera Properties"),
                        widget_1.tsx("br", null),
                        widget_1.tsx("span", null,
                            "Field of View ",
                            this.view.camera.fov),
                        widget_1.tsx("br", null),
                        widget_1.tsx("span", null,
                            "Heading ",
                            this.view.camera.heading.toFixed(2)),
                        widget_1.tsx("br", null),
                        widget_1.tsx("span", null,
                            "Position ",
                            this.view.camera.position.x.toFixed(2),
                            "/",
                            this.view.camera.position.y.toFixed(2)),
                        widget_1.tsx("br", null),
                        widget_1.tsx("span", null,
                            "Tilt ",
                            this.view.camera.tilt.toFixed(2)));
                }
            }
            return (widget_1.tsx("div", { class: this.classes(CSS.base, CSS.specific, classes) },
                "View size ",
                this.view.height,
                "*",
                this.view.width,
                widget_1.tsx("br", null),
                widget_1.tsx("span", { class: this.getTrueFalseClass(this.view.updating) },
                    "Updating ",
                    this.view.updating),
                widget_1.tsx("br", null),
                widget_1.tsx("span", { class: this.getTrueFalseClass(!this.view.stationary) },
                    "Animating ",
                    !this.view.stationary),
                widget_1.tsx("br", null),
                widget_1.tsx("span", { class: this.getTrueFalseClass(this.view.resizing) },
                    "Resizing ",
                    this.view.resizing),
                widget_1.tsx("br", null),
                viewSpecificProps));
        };
        WatchWidget.prototype.getTrueFalseClass = function (prop) {
            if (prop) {
                return "markTrue";
            }
            else {
                return "markFalse";
            }
        };
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], WatchWidget.prototype, "view", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], WatchWidget.prototype, "firstName", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], WatchWidget.prototype, "lastName", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], WatchWidget.prototype, "emphasized", void 0);
        WatchWidget = __decorate([
            decorators_1.subclass("esri.widgets.WatchWidget")
        ], WatchWidget);
        return WatchWidget;
    }(decorators_1.declared(Widget_1.default)));
    ;
    return WatchWidget;
});
//# sourceMappingURL=WatchWidget.js.map