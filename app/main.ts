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

const map = new EsriMap({
  basemap: "gray-vector"
});

const mapView = new MapView({
  map: map,
  container: "mapDiv",
  center: [-118.244, 34.052],
  zoom: 3
});
const sceneView = new SceneView({
  map: map,
  container: "sceneDiv",
  center: [-118.244, 34.052],
  zoom: 3
});

const weinLayer = new FeatureLayer({
  url: "http://services.arcgis.com/OLiydejKCZTGhvWg/arcgis/rest/services/WeinanbauGebiete/FeatureServer/0"
});
map.add(weinLayer);
let weinQuery = weinLayer.createQuery();
weinQuery.where = "1=1";
weinQuery.outFields = ["*"];

addWidgets(mapView);
addWidgets(sceneView);

mapView.when(() => {
  weinLayer.queryExtent(weinQuery).then((result: any) => {
    mapView.goTo(result.extent, {
      animate: true,
      duration: 10000,
      easing: "ease-out"
    });
  });
});

sceneView.when(() => {
  weinLayer.queryExtent(weinQuery).then((result: any) => {
    sceneView.goTo(result.extent, {
      animate: true,
      duration: 10000,
      easing: "ease-out"
    }).then(() => {
      sceneView.watch("center", (c: Point) => {
        mapView.center = c;
      });
    });
  });
});


function addWidgets(view: View) {
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
    layer: weinLayer,
    region: "DE"
  });
  view.ui.add(scaleRangeSlider, "bottom-left");
  scaleRangeSlider.watch(["minScale", "maxScale"], function(value, oldValue, name) {
    weinLayer[name] = value;
  });

  var searchWidget = new Search({
    view: view
  });
  view.ui.add(searchWidget, {
    position: "top-right",
    index: 0
  });
}

