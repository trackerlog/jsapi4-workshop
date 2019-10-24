import EsriMap from "esri/Map";
import MapView from "esri/views/MapView";
import FeatureLayer from "esri/layers/FeatureLayer";
import LayerList from "esri/widgets/LayerList";

const map = new EsriMap({
  basemap: "gray"
});

const view = new MapView({
  map: map,
  container: "viewDiv",
  center: [-118.244, 34.052],
  zoom: 3
});

var layerList = new LayerList({
  view: view
});
view.ui.add(layerList, {
  position: "bottom-right",
  index: 0
});

view.when(() => {
  const weinLayer = new FeatureLayer({
    url: "http://services.arcgis.com/OLiydejKCZTGhvWg/arcgis/rest/services/WeinanbauGebiete/FeatureServer/0"
  });
  
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
