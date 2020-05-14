/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import { subclass, declared, property } from "esri/core/accessorSupport/decorators";

import Widget from "esri/widgets/Widget";

import { renderable, tsx } from "esri/widgets/support/widget";
import View from "esri/views/View";
import SceneView from "esri/views/SceneView";
import MapView from "esri/views/MapView";

const CSS = {
    base: "esri-widget",
    specific: "watch-widget",
    emphasis: "watch-widget--emphasis"
};

@subclass("esri.widgets.WatchWidget")
class WatchWidget extends declared(Widget) {
    constructor(view: View) {
        super();
        this.view = view;
    }

    @property()
    @renderable()
    view: View;

    @property()
    @renderable()
    emphasized: boolean = false;

    // Public method
    render() {
        const classes = {
            [CSS.emphasis]: this.emphasized
        };

        let viewSpecificProps: JSX.Element;
        if (this.view.type=="2d") {
            let mapView = this.view as MapView;
            if (mapView.extent) {
                viewSpecificProps = <div>
                    <span class={CSS.emphasis}>Extent Properties</span><br/>
                    <span>X left {mapView.extent.xmin.toFixed(2)}</span><br/>
                    <span>X right {mapView.extent.xmax.toFixed(2)}</span><br/>
                    <span>Y bottom {mapView.extent.ymin.toFixed(2)}</span><br/>
                    <span>Y top {mapView.extent.ymax.toFixed(2)}</span><br/>
                    <span>Rotation {mapView.rotation.toFixed(2)}</span><br/>
                    <span>Center {mapView.center.x.toFixed(2)}/{mapView.center.y.toFixed(2)}</span>
                </div>
            }
        }
        else if (this.view.type=="3d") {
            let sceneView = this.view as SceneView;
            if (sceneView.camera) {
                viewSpecificProps = <div>
                    <span class={CSS.emphasis}>Camera Properties</span><br/>
                    <span>Field of View {sceneView.camera.fov}</span><br/>
                    <span>Heading {sceneView.camera.heading.toFixed(2)}</span><br/>
                    <span>Position {sceneView.camera.position.x.toFixed(2)}/{sceneView.camera.position.y.toFixed(2)}</span><br/>
                    <span>Tilt {sceneView.camera.tilt.toFixed(2)}</span>
                </div>
            }
        }

        return (
            <div class={this.classes(CSS.base, CSS.specific, classes)}>
                View size {this.view.height}*{this.view.width}<br/>
                <span class={this.getTrueFalseClass(this.view.updating)}>Updating {this.view.updating}</span><br/>
                <span class={this.getTrueFalseClass(!this.view.stationary)}>Animating {!this.view.stationary}</span><br/>
                <span class={this.getTrueFalseClass(this.view.resizing)}>Resizing {this.view.resizing}</span><br/>
                {viewSpecificProps}
            </div>
        );
    }

    private getTrueFalseClass(prop: boolean) {
        if (prop) {
            return "markTrue";
        }
        else {
            return "markFalse";
        }
    }
};

export = WatchWidget;