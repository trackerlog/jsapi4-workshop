import EsriMap from "esri/Map";
import MapView from "esri/views/MapView";
import FeatureLayer from "esri/layers/FeatureLayer";
import LayerList from "esri/widgets/LayerList";
import Compass from "esri/widgets/Compass";
import Search from "esri/widgets/Search";
import View from "esri/views/View";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import Editor from "esri/widgets/Editor";
import FeatureLayerView from "esri/views/layers/FeatureLayerView";
import Handle from "esri/core/Handles";
import Renderer from "esri/renderers/Renderer";
import Legend from "esri/widgets/Legend";
import WatchWidget from "./WatchWidget";
import Graphic from "esri/Graphic";
import FeatureSet from "esri/tasks/support/FeatureSet";
import { createPCTrueColorRenderer } from "esri/renderers/smartMapping/creators/color";
import Color from "esri/Color";

// interface ISketchCreateEvent {
//   state: string;
//   graphic: Graphic;
// }

// adapted from https://developers.arcgis.com/javascript/latest/sample-code/visualization-vv-rotation/index.html

class LearnJsapi4App {

  private map: EsriMap;
  mapView: MapView;
  sketchLayer: GraphicsLayer;
  editLayer: FeatureLayer;
  
  // Complex Symbol sample vars
  private innerHighlightHandle: Handle;
  private outerHighlightHandle: Handle;
  private iconPaths = {
    "arrow": "M14.5,29 23.5,0 14.5,9 5.5,0z",
    "smiley": "M24.0,2.199C11.9595,2.199,2.199,11.9595,2.199,24.0c0.0,12.0405,9.7605,21.801,21.801,21.801c12.0405,0.0,21.801-9.7605,21.801-21.801C45.801,11.9595,36.0405,2.199,24.0,2.199zM31.0935,11.0625c1.401,0.0,2.532,2.2245,2.532,4.968S32.4915,21.0,31.0935,21.0c-1.398,0.0-2.532-2.2245-2.532-4.968S29.697,11.0625,31.0935,11.0625zM16.656,11.0625c1.398,0.0,2.532,2.2245,2.532,4.968S18.0555,21.0,16.656,21.0s-2.532-2.2245-2.532-4.968S15.258,11.0625,16.656,11.0625zM24.0315,39.0c-4.3095,0.0-8.3445-2.6355-11.8185-7.2165c3.5955,2.346,7.5315,3.654,11.661,3.654c4.3845,0.0,8.5515-1.47,12.3225-4.101C32.649,36.198,28.485,39.0,24.0315,39.0z"
  }
  private initColor = "#ce641d";
  private weatherSvgLayer: any;
  private weatherSimpleLayer: FeatureLayer;
  private weatherSvgFlv: FeatureLayerView;
  private weatherSimpleFlv: FeatureLayerView;
  private ctrlKeyDown: boolean;
  

  constructor() {
    this.initializeMap();
    this.addEditLayer();

    // this.sketchLayer = this.initNewGraphicsLayer("sketchLayer", "Sketch Layer");
    // this.map.add(this.sketchLayer);

    this.mapView = this.initializeMapView();

    this.mapView.when(() => {
      this.addWidgets(this.mapView);
      
      // let query = this.editLayer.createQuery();
      // this.editLayer.queryExtent(query).then((result: any) => {
      //   this.mapView.goTo(result.extent, {
      //     animate: false
      //   });
      // });
    });

    document.addEventListener('keydown', this.logKeyDown);
    document.addEventListener('keyup', this.logKeyUp);
  }

  private logKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode===17) { // ctrl key
      this.ctrlKeyDown = true;
      console.log(this.ctrlKeyDown);
      
    }
  }
  private logKeyUp = (e: KeyboardEvent) => {
    if (e.keyCode===17) { // ctrl key
      this.ctrlKeyDown = false;
      console.log(this.ctrlKeyDown);
    }
  }

  private initializeMap() {

    const svgRenderer = {
      type: "simple",
      symbol: this.createSvgSymbol(this.iconPaths.arrow, this.initColor),
      visualVariables: [
        {
          type: "rotation",
          field: "WIND_DIRECT",
          rotationType: "geographic"
        },
        {
          type: "size",
          field: "WIND_SPEED",
          minDataValue: 0,
          maxDataValue: 60,
          minSize: 8,
          maxSize: 40
        }
      ]
    } as unknown as Renderer;

    const circleRenderer = {
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: 50,
        color: [255,255,255,0],
        outline: {
          color: "#9ABBDF",
          width: 3
        },
        style: "circle"
      }
    } as unknown as Renderer;

    this.weatherSvgLayer = this.createWeatherLayer("weatherSvg", svgRenderer);
    this.weatherSimpleLayer = this.createWeatherLayer("weatherSimple", circleRenderer);

    const mapProperties = {
      basemap: "gray-vector",
      layers: [this.weatherSvgLayer, this.weatherSimpleLayer]
    };

    this.map = new EsriMap(mapProperties);
  }

  private createSvgSymbol(path: string, color: string | number[]) {
    return {
      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
      path: path,
      color: "#9ABBDF",
      outline: {
        color: "#00337F",
        width: 0.5
      },
      angle: 180,
      size: 15
    };
  }

  private createWeatherLayer(id: string, renderer: Renderer) {
    return new FeatureLayer({
      url:
        "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/weather_stations_010417/FeatureServer/0",
        renderer: renderer,
        id: id
    })
  }


  private initNewGraphicsLayer(id: string, title: string) {
    let gl = new GraphicsLayer({
      id: id,
      title: title
    });
    return gl;
  }

  private initializeMapView(): MapView {
    const mapViewProperties = {
      container: "mapDiv",
      center: {"spatialReference":{"latestWkid":3857,"wkid":102100},"x":438847.5319327719,"y":6930766.444916215},
      zoom: 7,
      map: this.map,
      highlightOptions: {
        color: [255, 255, 0, 1],
        haloOpacity: 0.9,
        fillOpacity: 0.2
      }
    };

    let view = new MapView(mapViewProperties);

    view.popup.autoOpenEnabled = false;

    view.on("click", (event: any) => {
      view.hitTest(event).then((response: any) => {
        if (response.results.length) {
          let svgResults = response.results.filter((result: any) => result.graphic.layer.id === "weatherSvg");
          svgResults.forEach((svgResult: any) => {
            let svgFeature: Graphic = svgResult.graphic;
            let objectIdField = (svgFeature.layer as FeatureLayer).objectIdField;
            
            let weatherSimpleQuery = this.weatherSimpleLayer.createQuery();
            weatherSimpleQuery.where = objectIdField + "=" + svgFeature.attributes[objectIdField];
            this.weatherSimpleLayer.queryFeatures(weatherSimpleQuery).then((response: FeatureSet) => {
              console.log(this.ctrlKeyDown);
              
              if (this.ctrlKeyDown === false) {
                if (this.innerHighlightHandle) {
                  this.innerHighlightHandle.remove();
                }
                if (this.outerHighlightHandle) {
                  this.outerHighlightHandle.remove();
                }
              }
              this.innerHighlightHandle = this.weatherSvgFlv.highlight(svgFeature) as unknown as Handle;
              this.outerHighlightHandle = this.weatherSimpleFlv.highlight(response.features[0]) as unknown as Handle;
            });
          });
        }
      });
    });

    view.whenLayerView(this.weatherSvgLayer).then((flv: FeatureLayerView) => {
      this.weatherSvgFlv = flv;
    });
    view.whenLayerView(this.weatherSimpleLayer).then((flv: FeatureLayerView) => {
      this.weatherSimpleFlv = flv;
    });

    return view;
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

    // var editor = new Editor({
    //   view: view
    // });
    // view.ui.add(editor, {
    //   position: "top-right",
    //   index: 0
    // });

    view.ui.add(
      new Legend({
        view: view,
        layerInfos: [
          {
            layer: this.weatherSvgLayer
          }
        ]
      }),
      "bottom-left"
    );

    // view.ui.add(new WatchWidget(view), "top-right");

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
