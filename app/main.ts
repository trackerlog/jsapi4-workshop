import EsriMap from "esri/Map";
import MapView from "esri/views/MapView";
import FeatureLayer from "esri/layers/FeatureLayer";
import LayerList from "esri/widgets/LayerList";
import Compass from "esri/widgets/Compass";
import ScaleRangeSlider from "esri/widgets/ScaleRangeSlider";
import Search from "esri/widgets/Search";
import SceneView from "esri/views/SceneView";
import View from "esri/views/View";
import { Point } from "esri/geometry";

import WatchWidget from "./WatchWidget";
import GeometryWidget from "./GeometryWidget";
import FeatureLayerView from "esri/views/layers/FeatureLayerView";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import Sketch from "esri/widgets/Sketch";
import Editor from "esri/widgets/Editor";
import Graphic from "esri/Graphic";

interface ISketchCreateEvent {
  state: string;
  graphic: Graphic;
}

class LearnJsapi4App {

  private map : EsriMap;
  mapView: MapView;
  sceneView: SceneView;
  weinLayer: FeatureLayer;
  weinQuery: __esri.Query;
  fotoLayer: FeatureLayer;
  sketchLayer: GraphicsLayer;
  editLayer: FeatureLayer;
  
  constructor() {
    this.initializeMap();
    this.addWeinLayer();
    this.addFotoLayer();
    this.addEditLayer();
    this.sketchLayer = this.initNewGraphicsLayer("sketchLayer", "Sketch Layer");
    this.map.add(this.sketchLayer);
    this.mapView = this.viewFactory(MapView, "mapDiv");
    this.sceneView = this.viewFactory(SceneView, "sceneDiv");
    this.addCenterWatch(this.mapView, this.sceneView);
  }

  private addCenterWatch(watchView: View, setCenterView: View) {
    let watchHandle = watchView.watch("stationary", (s: boolean) => {
      if (s) {
        setCenterView.watch("center", (c: Point) => {
          this.mapView.center = c;
        });
        watchHandle.remove();
      }
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

  private viewFactory<V extends View>(view: new(parameters: object) => V, containerDiv: string): V {
    let initView = new view({
      map: this.map,
      container: containerDiv,
      highlightOptions: {
        color: [255, 255, 0, 1],
        haloOpacity: 0.9,
        fillOpacity: 0.2
      },          
      popup: {
        dockEnabled: true,
        dockOptions: {
          buttonEnabled: true,
          breakpoint: true
        },
        defaultPopupTemplateEnabled: true,
        autoOpenEnabled: true
      }
    });

    initView.when(() => {
      this.addWidgets(initView);

      this.weinLayer.queryExtent(this.weinQuery).then((result: any) => {
        initView.goTo(result.extent, {
          animate: true,
          duration: 10000,
          easing: "ease-out"
        });
      });
    });
    return initView;
  }

  private addEditLayer() {
    this.editLayer = new FeatureLayer({
      url: "https://services.arcgis.com/OLiydejKCZTGhvWg/arcgis/rest/services/jsapi4_Workshop_Editierlayer/FeatureServer/0"
    });
    this.map.add(this.editLayer);
  }

  private addWeinLayer() {
    this.weinLayer = new FeatureLayer({
      url: "http://services.arcgis.com/OLiydejKCZTGhvWg/arcgis/rest/services/WeinanbauGebiete/FeatureServer/0"
    });
    this.map.add(this.weinLayer);
    this.weinQuery = this.weinLayer.createQuery();
    this.weinQuery.where = "1=1";
    this.weinQuery.outFields = ["*"];
  }

  private addFotoLayer() {
    let template = {
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
            type: "image", // Autocasts as new ImageMediaInfo()
            caption: "{Stadtbezirk}",
            // Autocasts as new ImageMediaInfoValue()
            value: {
              sourceURL: "{BildURL}"
            }
          }]
        }
      ]
    };

    this.fotoLayer = new FeatureLayer({
      url: "http://services.arcgis.com/OLiydejKCZTGhvWg/arcgis/rest/services/Sehenswuerdigkeiten_POIs_3/FeatureServer/0",
      popupTemplate: template
    });
    this.map.add(this.fotoLayer);

  }
  
  private addWidgets(view: View) {
    let layerList = new LayerList({
      view: view
    });
    view.ui.add(layerList, {
      position: "bottom-right",
      index: 0
    });
  
    if (view.type=="2d") {
      let compass = new Compass({
        view: view
      });
      view.ui.add(compass, "top-left");
    }
  
    let scaleRangeSlider = new ScaleRangeSlider({
      view: view,
      layer: this.weinLayer,
      region: "DE"
    });
    view.ui.add(scaleRangeSlider, {
      position: "top-left",
      index: 0
    });
    scaleRangeSlider.watch(["minScale", "maxScale"], function(value, oldValue, name) {
      this.weinLayer[name] = value;
    });
  
    let searchWidget = new Search({
      view: view
    });
    view.ui.add(searchWidget, {
      position: "top-right",
      index: 1
    });

    var editor = new Editor({
      view: view,
      layerInfos: [{
        layer: this.editLayer,
        allowAttachments: true
      }
    });
    view.ui.add(editor, {
      position: "top-right",
      index: 0
    });

    var sketch = new Sketch({
      layer: this.sketchLayer,
      view: view
    });
    // Listen to sketch widget's create event.
    sketch.on("create", (event: ISketchCreateEvent) => {
      if (event.state === "complete") {
       if(event.graphic.geometry.type === "polygon") {
        if (this.editLayer) {
          this.editLayer.applyEdits({
            addFeatures: [event.graphic]
          });
          this.sketchLayer.remove(event.graphic);
        }
        else {
          console.warn("Editierlayer ungültig.");
        }
       }
      }
    });
    view.ui.add(sketch, {
      position: "top-right",
      index: 0
    });

    let geometryWidget = new GeometryWidget(view);
    geometryWidget.setSelectionTarget(this.weinLayer);
    geometryWidget.setEditLayer(this.editLayer);
    view.whenLayerView(this.weinLayer).then((layerView: FeatureLayerView) => {
      geometryWidget.setLayerView(layerView);
    });
    view.ui.add(geometryWidget, {
      position: "top-right",
      index: 3
    });

    let watchWidget = new WatchWidget(view)
    view.ui.add(watchWidget, {
      position: "bottom-left",
      index: 0
    });
  }
  
}

let app = new LearnJsapi4App();