import EsriMap from "esri/Map";
import MapView from "esri/views/MapView";
import FeatureLayer from "esri/layers/FeatureLayer";
import LayerList from "esri/widgets/LayerList";
import Compass from "esri/widgets/Compass";
import Search from "esri/widgets/Search";
import SceneView from "esri/views/SceneView";
import View from "esri/views/View";

import GraphicsLayer from "esri/layers/GraphicsLayer";
import Editor from "esri/widgets/Editor";

// interface ISketchCreateEvent {
//   state: string;
//   graphic: Graphic;
// }

class LearnJsapi4App {

  private map: EsriMap;
  mapView: MapView;
  sceneView: SceneView;
  sketchLayer: GraphicsLayer;
  editLayer: FeatureLayer;
  weinLayer: any;

  constructor() {
    this.initializeMap();
    this.addEditLayer();

    // this.sketchLayer = this.initNewGraphicsLayer("sketchLayer", "Sketch Layer");
    // this.map.add(this.sketchLayer);

    this.mapView = this.viewFactory(MapView, "mapDiv");

    this.mapView.when(() => {
      this.addWidgets(this.mapView);

      let query = this.editLayer.createQuery();
      this.editLayer.queryExtent(query).then((result: any) => {
        this.mapView.goTo(result.extent, {
          animate: false
        });
      });

    });
  }

  private initializeMap() {
    this.map = new EsriMap({
      basemap: "gray-vector"
    });
  }

  private initNewGraphicsLayer(id: string, title: string) {
    let gl = new GraphicsLayer({
      id: id,
      title: title
    });
    return gl;
  }

  private viewFactory<V extends View>(view: new (parameters: object) => V, containerDiv: string): V {
    let initView = new view({
      map: this.map,
      container: containerDiv
    });
    return initView;
  }

  private addEditLayer() {
    this.editLayer = new FeatureLayer({
      url: "https://services.arcgis.com/OLiydejKCZTGhvWg/arcgis/rest/services/jsapi4_Workshop_Editierlayer/FeatureServer/0"
    });
    this.map.add(this.editLayer);
  }

  private addWidgets(view: View) {
    let layerList = new LayerList({
      view: view
    });
    view.ui.add(layerList, {
      position: "bottom-right",
      index: 0
    });

    if (view.type == "2d") {
      let compass = new Compass({
        view: view
      });
      view.ui.add(compass, "top-left");
    }

    let searchWidget = new Search({
      view: view
    });
    view.ui.add(searchWidget, {
      position: "top-right",
      index: 1
    });

    var editor = new Editor({
      view: view
    });
    view.ui.add(editor, {
      position: "top-right",
      index: 0
    });

    //   var sketch = new Sketch({
    //     layer: this.sketchLayer,
    //     view: view
    //   });
    //   // Listen to sketch widget's create event.
    //   sketch.on("create", (event: ISketchCreateEvent) => {
    //     if (event.state === "complete") {
    //      if(event.graphic.geometry.type === "polygon") {
    //       if (this.editLayer) {
    //         this.editLayer.applyEdits({
    //           addFeatures: [event.graphic]
    //         });
    //         this.sketchLayer.remove(event.graphic);
    //       }
    //       else {
    //         console.warn("Editierlayer ungültig.");
    //       }
    //      }
    //     }
    //   });
    //   view.ui.add(sketch, {
    //     position: "top-right",
    //     index: 0
    //   });

  }
}

let app = new LearnJsapi4App();
