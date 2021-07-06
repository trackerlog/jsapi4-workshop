import Extent from "esri/geometry/Extent";
import EsriMap from "esri/Map";
import MapView from "esri/views/MapView";



const map = new EsriMap({
  basemap: "streets"
});

const view = new MapView({
  map: map,
  container: "viewDiv",
  center: [7.067903577374039,50.7146554517104],
  zoom: 20
});

view.watch("extent", (myex:Extent)=> 
  console.log("center:", [myex.center.x,myex.center.y])
);
