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
  };

  featureCounter: number;

  @property()
  @renderable()
  view:View;
  
  @property()
  @renderable()
  emphasized: boolean=false;

  render() {
    const classes ={
      [CSS.emphasis]:this.emphasized
    };

    return (
      <div class={this.classes(CSS.base,CSS.specific,classes)}>
        {this.generateResult()}
        </div>
    );
  }

  generateResult() {
    const allFLLayerViewsCollection = (this.view.allLayerViews.filter((lv:LayerView)=> lv.declaredClass.indexOf("FeatureLayerView")>-1));
    let anzahlFL = allFLLayerViewsCollection.length;
    
    if (anzahlFL>0){ // wenn featurelayer vorhanden
      allFLLayerViewsCollection.map((lv:LayerView)=>{
        lv.when((l:FeatureLayer)=>{
          l.queryFeatureCount().then((results)=>{return this.featureCounter = results})})
        return console.log("mapping works")})
    }
    return "derzeit sind " + anzahlFL +" Feature Layer sichtbar mit insgesamt "  + this.featureCounter + " Features"
  };
};
  
export = MyWidget;