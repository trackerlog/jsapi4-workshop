import Widget from "esri/widgets/Widget";
import { subclass,declared,property } from "esri/core/accessorSupport/decorators";
import { renderable,tsx } from "esri/widgets/support/widget";
import View from "esri/views/View";
import LayerView from "esri/views/layers/LayerView";
import FeatureLayerView from "esri/views/layers/FeatureLayerView";
import Layer from "esri/layers/Layer";
import FeatureLayer from "esri/layers/FeatureLayer";

const CSS ={
  base:"esri-widgets",
  specific: "my-widget",
  emphasis: "my-widget--emphasis"
}

@subclass("esri.widgets.MyWidget") //decorator notwendig um klar zu machen, dass das Widget, im EsriNamespace ist
class MyWidget extends declared(Widget) {
  constructor(view:View){
    super();
    this.view = view;
    this.featureCounter = 0;
    //this.viewWatcher = this.view.watch("extent", ()=>this.generateResult);
  };
  
  @property()
  @renderable()
  viewWatcher:any

  //@renderable()
  featureCounter: number;

  @property()
  @renderable()
  view:View;
  
  @property()
  @renderable()
  emphasized: boolean=false;

  myOnChange(){
    this.view.watch("extent", ()=>this.generateResult)
  }

  render() {
    const classes ={
      [CSS.emphasis]:this.emphasized
    };

    return (
      <div class={this.classes(CSS.base,CSS.specific,classes)}>
        {this.featureCounter} + {this.view.watch("extent", ()=> console.log("text"))}
        </div>
    );
  }

  generateResult() {
    const allFLLayerViewsCollection = (this.view.allLayerViews.filter((lv:LayerView)=> lv.declaredClass.indexOf("FeatureLayerView")>-1));
    let anzahlFL = allFLLayerViewsCollection.length;
    console.log(anzahlFL)
    if (anzahlFL>0){ // wenn featurelayer vorhanden
      allFLLayerViewsCollection.map((lv:LayerView)=>{
        lv.when((l:FeatureLayer)=>{
          l.queryFeatureCount().then((results)=>
          {return this.featureCounter = results})})
        return console.log("mapping works")})
    } // Mapping mit reduce? um alle Features zu addieren???
    return "derzeit sind " + anzahlFL +" Feature Layer sichtbar mit insgesamt "  + this.featureCounter + " Features" 
  };
};
  
export = MyWidget;


