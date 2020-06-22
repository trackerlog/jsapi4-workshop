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

// interface ISketchCreateEvent {
//   state: string;
//   graphic: Graphic;
// }

class LearnJsapi4App {

  private map: EsriMap;
  mapView: MapView;
  sketchLayer: GraphicsLayer;
  editLayer: FeatureLayer;
  
  // Complex Symbol sample vars
  private citiesFlv: FeatureLayerView;
  private innerHighlightHandle: Handle;
  private outerHighlightHandle: Handle;
  private iconPath = "M24.0,2.199C11.9595,2.199,2.199,11.9595,2.199,24.0c0.0,12.0405,9.7605,21.801,21.801,21.801c12.0405,0.0,21.801-9.7605,21.801-21.801C45.801,11.9595,36.0405,2.199,24.0,2.199zM31.0935,11.0625c1.401,0.0,2.532,2.2245,2.532,4.968S32.4915,21.0,31.0935,21.0c-1.398,0.0-2.532-2.2245-2.532-4.968S29.697,11.0625,31.0935,11.0625zM16.656,11.0625c1.398,0.0,2.532,2.2245,2.532,4.968S18.0555,21.0,16.656,21.0s-2.532-2.2245-2.532-4.968S15.258,11.0625,16.656,11.0625zM24.0315,39.0c-4.3095,0.0-8.3445-2.6355-11.8185-7.2165c3.5955,2.346,7.5315,3.654,11.661,3.654c4.3845,0.0,8.5515-1.47,12.3225-4.101C32.649,36.198,28.485,39.0,24.0315,39.0z";
  private initColor = "#ce641d";
  citiesSvgLayer: any;
  hwyLayer: any;
  

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
  }

  private initializeMap() {

    const citiesSvgRenderer = {
      type: "simple",
      symbol: this.createSvgSymbol(this.iconPath, this.initColor)
    } as unknown as Renderer;

    const citiesSimpleRenderer = {
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: 50,
        color: [255, 255, 255, 0],
        outline: {
          color: [128, 128, 128, 1],
          width: 3
        },
        style: "circle"
      }
    } as unknown as Renderer;

    this.citiesSvgLayer = this.createCitiesLayer("citiesSvg", citiesSvgRenderer);
    let citiesSimpleLayer = this.createCitiesLayer("citiesSimple", citiesSimpleRenderer);

    this.hwyLayer = this.createFreewayLayer();
    let statesLayer = this.createStatesLayer();

    const mapProperties = {
      // basemap: this._basemap,
      layers: [statesLayer, this.hwyLayer, this.citiesSvgLayer, citiesSimpleLayer]
    };

    this.map = new EsriMap(mapProperties);
  }

  private createSvgSymbol(path: string, color: string | number[]) {
    return {
      type: "simple-marker",
      size: 10,
      color: color,
      outline: null as string,
      path: path
    }
  }

  private createCitiesLayer(id: string, renderer: Renderer) {
    return new FeatureLayer({
      url:
        "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/WorldCities/FeatureServer/0",
      renderer: renderer,
      definitionExpression: "adm = 'United States of America'",
      id: id
    });
  }


  private createStatesLayer() {
    const statesRenderer = {
      type: "simple", // autocasts as new SimpleRenderer()
      symbol: {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: [0, 0, 0, 0],
        outline: {
          color: [50, 50, 50, 0.7],
          width: 0.5
        }
      }
    } as unknown as Renderer;
    return new FeatureLayer({
      url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3",
      renderer: statesRenderer
    });
  }

  private createFreewayLayer() {
    const hwyRenderer = {
      type: "simple", // autocasts as new SimpleRenderer()
      symbol: {
        type: "simple-line", // autocasts as new SimpleLineSymbol()
        width: 1,
        color: [0, 255, 255, 0.2]
      }
    } as unknown as Renderer;
    return new FeatureLayer({
      url:
        "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Freeway_System/FeatureServer/2",
      renderer: hwyRenderer,
      minScale: 0,
      maxScale: 0,
      title: "Freeways"
    });
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
      // center: this._center,
      // zoom: this._zoom,
      map: this.map,
      extent: {
        xmin: -3094834,
        ymin: -44986,
        xmax: 2752687,
        ymax: 3271654,
        spatialReference: {
          wkid: 5070
        }
      },
      spatialReference: {
        // NAD_1983_Contiguous_USA_Albers
        wkid: 5070
      },
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
          let svgResults = response.results.filter((result: any) => result.graphic.layer.id === "citiesSimple");
          console.log("Hit test", response, svgResults);
          svgResults.forEach((svgResult: any) => {
            this.innerHighlightHandle = this.citiesFlv.highlight(svgResult.graphic) as unknown as Handle;
            console.log("highlight", svgResult.graphic);
          });
        }
      });
    });

    view.whenLayerView(this.citiesSvgLayer).then((flv: FeatureLayerView) => {
      this.citiesFlv = flv;
    });

    // view.ui.add(
    //   new Legend({
    //     view: view,
    //     layerInfos: [
    //       {
    //         layer: this.hwyLayer,
    //         hideLayers: []
    //       }
    //     ]
    //   }),
    //   "bottom-left"
    // );

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
