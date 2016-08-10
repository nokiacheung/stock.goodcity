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

  hasDesignation: Ember.computed("item.{isDesignated,isSet,setItem.items.@each.isDesignated}", function() {
    if(this.get("item.isSet")) {
      var allItems = this.get("item.setItem.items");
      return allItems.filterBy("isDesignated").length > 0;
    } else {
      return this.get("item.isDesignated");
    }
  }),

});
