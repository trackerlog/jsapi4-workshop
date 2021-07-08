import Widget from "esri/widgets/Widget";
import { subclass,declared,property } from "esri/core/accessorSupport/decorators";
import { renderable,tsx } from "esri/widgets/support/widget";
import View from "esri/views/View";
import LayerView from "esri/views/layers/LayerView";
import FeatureLayerView from "esri/views/layers/FeatureLayerView";

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
  };

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
    //let firstFL = allFLLayerViewsCollection[0];
    //let myQuery = firstFL.queryExtent()

    /* hier die Version für alle Layer 
      let a_Feat = allFLLayerViewsCollection.map((myCount:Int16Array)=>{
      //hier muss der query für jeden Layer hin und die Anzahl der Features
      let result = 
      myCount = 
    }); */
    //let anzahlFeatures = a_Feat.reduce((a,b)=>{return a+b;})
    return anzahlFL;
  };
};
  
export = MyWidget;