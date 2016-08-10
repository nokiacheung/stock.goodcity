import Ember from "ember";

export default Ember.Controller.extend({
  item: Ember.computed.alias("model"),
  backLinkPath: "",
  queryParams: ['showDispatchOverlay'],
  showDispatchOverlay: false,
  autoDisplayOverlay: false,

  performDispatch: Ember.observer("showDispatchOverlay", function() {
    Ember.run.debounce(this, this.updateAutoDisplayOverlay, 100);
  }),

  updateAutoDisplayOverlay() {
    if (this.get("showDispatchOverlay")) {
      this.toggleProperty('autoDisplayOverlay');
    }
  },

  allDispatched: Ember.computed("item.{isDispatched,isSet,setItem.items.@each.isDispatched}", function() {
    if(this.get("item.isSet")) {
      return this.get("item.setItem.allDispatched");
    } else {
      return this.get("item.isDispatched");
    }
  }),

  hasDesignation: Ember.computed("item.{isDesignated,isSet,setItem.items.@each.isDesignated}", function() {
    if(this.get("item.isSet")) {
      var allItems = this.get("item.setItem.items");
      return !this.get("item.setItem.allDispatched") && (allItems.filterBy("isDesignated").length > 0);
    } else {
      return this.get("item.isDesignated");
    }
  }),

});
