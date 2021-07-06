import Extent from "esri/geometry/Extent";
import FeatureLayer from "esri/layers/FeatureLayer";
import TileLayer from "esri/layers/TileLayer";
import WFSLayer from "esri/layers/WFSLayer";
import EsriMap from "esri/Map";
import MapView from "esri/views/MapView";
import SceneView from "esri/views/SceneView";
import BasemapGallery from "esri/widgets/BasemapGallery";
import Search from "esri/widgets/Search";


/*
FUNCTION DECL
*/
function myAddLayer(myMap:EsriMap, myURL:string, myLayerType:string){
  let myLayer; // outputlayer
   if (myLayerType=="WFS"){
     myLayer = new WFSLayer({
     url: myURL
   }); 
  };
  if (myLayerType== "FL"){
     myLayer = new FeatureLayer({
     url:myURL
   });
  };
  if (myLayerType=="TILES"){ // TODO
    myLayer = new TileLayer({
      url:myURL
    });
  };
  myMap.add(myLayer);  
 };


 
/*
MAP CREATION
*/


const mapOne = new EsriMap({
  basemap: "streets-vector"
});
const mapTwo = new EsriMap({
  basemap: "streets-vector"
});

const myMapView = new MapView({
  map: mapOne,
  container: "view2dDiv",
  center: [7.067903577374039,50.7146554517104],
  zoom: 20
});

const mySceneView = new SceneView({
  map: mapTwo,
  container: "view3dDiv",
  center: myMapView.center,
  zoom: 20
});

// ADD LAYER TO MAPS
let myWFS= "https://maps.dwd.de/geoserver/dwd/wfs?service=WFS&version=2.0.0&typeName=dwd%3ABiowettervorhersage"
let myFL = "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/Active_Hurricanes_v1/FeatureServer"
//let myTILE = "https://earthlive.maptiles.arcgis.com/arcgis/rest/services/GOES/GOES31C/"

myAddLayer(mapOne,myWFS,"WFS");
myAddLayer(mapOne,myFL,"FL");
//myAddLayer(mapOne,myTILE,"TILE");


// Create Search Widget
const mySearchWidget = new Search({
  view: myMapView
});

// Add Search Widget to MapViewUI
myMapView.ui.add(mySearchWidget,{
  position: "top-left",
  index: 0
})

// Create Basemap Widget
const myBasemapGallery = new BasemapGallery({
  view: myMapView
});

// Add Basemap Widget to MapViewUI
myMapView.ui.add(myBasemapGallery,{
  position: "bottom-right"
})


// console.log falls extent in Map 1 sich ändert
myMapView.watch("extent", (myex:Extent)=> 
  console.log("center view (Links):", [myex.center.x,myex.center.y])
);

// extent von 1 auf 2 übertragen
myMapView.when(()=>{
  mySceneView.when(()=>{
    myMapView.watch("extent",(myex:Extent)=> {
      mySceneView.set("extent",myex.extent); 
    });
  });
});
  

