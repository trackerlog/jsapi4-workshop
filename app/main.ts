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

class LearnJsapi4App {

  private map : EsriMap;
  mapView: MapView;
  sceneView: SceneView;
  weinLayer: FeatureLayer;
  weinQuery: __esri.Query;
  
  constructor() {
    this.initializeMap();
    this.addWeinLayer();
    this.initializeMapView();
    this.initializeSceneView();
  }

  private initializeMap() {
    this.map = new EsriMap({
      basemap: "gray-vector"
    });
  }

  private initializeSceneView() {
    this.sceneView = new SceneView({
      map: this.map,
      container: "sceneDiv",
      center: [-118.244, 34.052],
      zoom: 3
    });
    this.addWidgets(this.sceneView);
    this.sceneView.when(() => {
      this.weinLayer.queryExtent(this.weinQuery).then((result: any) => {
        this.sceneView.goTo(result.extent, {
          animate: true,
          duration: 10000,
          easing: "ease-out"
        }).then(() => {
          this.sceneView.watch("center", (c: Point) => {
            this.mapView.center = c;
          });
        });
      });
    });
  }

  private initializeMapView() {
    this.mapView = new MapView({
      map: this.map,
      container: "mapDiv",
      center: [-118.244, 34.052],
      zoom: 3
    });
    this.addWidgets(this.mapView);
    this.mapView.when(() => {
      this.weinLayer.queryExtent(this.weinQuery).then((result: any) => {
        this.mapView.goTo(result.extent, {
          animate: true,
          duration: 10000,
          easing: "ease-out"
        });
      });
    });
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
  
  private addWidgets(view: View) {
    var layerList = new LayerList({
      view: view
    });
    view.ui.add(layerList, {
      position: "bottom-right",
      index: 0
    });
  
    if (view.type=="2d") {
      var compass = new Compass({
        view: view
      });
      view.ui.add(compass, "top-left");
    }
  
    const scaleRangeSlider = new ScaleRangeSlider({
      view: view,
      layer: this.weinLayer,
      region: "DE"
    });
    view.ui.add(scaleRangeSlider, "bottom-left");
    scaleRangeSlider.watch(["minScale", "maxScale"], function(value, oldValue, name) {
      this.weinLayer[name] = value;
    });
  
    var searchWidget = new Search({
      view: view
    });
    view.ui.add(searchWidget, {
      position: "top-right",
      index: 0
    });
  }
  
}


let app = new LearnJsapi4App();