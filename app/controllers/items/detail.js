import Ember from "ember";

export default Ember.Controller.extend({
  item: Ember.computed.alias("model"),
  backLinkPath: "",

  allDispatched: Ember.computed("item.{isDispatched,isSet,setItem.items.@each.isDispatched}", function() {
    if(this.get("item.isSet")) {
      var allItems = this.get("item.setItem.items");
      return allItems.length === allItems.filterBy("isDispatched").length;
    } else {
      return this.get("item.isDispatched");
    }
  }),

});
