import EsriMap from "esri/Map";
import MapView from "esri/views/MapView";
import FeatureLayer from "esri/layers/FeatureLayer";
import LayerList from "esri/widgets/LayerList";
import Compass from "esri/widgets/Compass";
import ScaleRangeSlider from "esri/widgets/ScaleRangeSlider";

const map = new EsriMap({
  basemap: "gray"
});

const view = new MapView({
  map: map,
  container: "viewDiv",
  center: [-118.244, 34.052],
  zoom: 3
});

const weinLayer = new FeatureLayer({
  url: "http://services.arcgis.com/OLiydejKCZTGhvWg/arcgis/rest/services/WeinanbauGebiete/FeatureServer/0"
});

addWidgets();

view.when(() => {
  let weinQuery = weinLayer.createQuery();
  weinQuery.where = "1=1";
  weinQuery.outFields = ["*"];
  let weinExtent = weinLayer.queryExtent(weinQuery).then((result: any) => {
  
    view.goTo(result.extent, {
      animate: true,
      duration: 10000,
      easing: "ease-out"
    });
    map.add(weinLayer);
  
  });
});


function addWidgets() {
  var layerList = new LayerList({
    view: view
  });
  view.ui.add(layerList, {
    position: "bottom-right",
    index: 0
  });

  var compass = new Compass({
    view: view
  });
  view.ui.add(compass, "top-left");

  const scaleRangeSlider = new ScaleRangeSlider({
    view: view,
    layer: weinLayer,
    region: "DE"
  });
  view.ui.add(scaleRangeSlider, "bottom-left");
  scaleRangeSlider.watch(["minScale", "maxScale"], function(value, oldValue, name) {
    weinLayer[name] = value;
  });

}

