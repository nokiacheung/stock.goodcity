import Ember from "ember";
import config from '../../config/environment';

export default Ember.Controller.extend({
  isMobileApp: config.cordova.enabled,
  item: Ember.computed.alias("model"),
  backLinkPath: "",
  queryParams: ['showDispatchOverlay'],
  showDispatchOverlay: false,
  autoDisplayOverlay: false,
  messageBox: Ember.inject.service(),
  displayScanner: false,
  designateFullSet: Ember.computed.localStorage(),
  callOrderObserver: false,

  grades: Ember.computed(function(){
    return [
      { name: "A", id: "A" },
      { name: "B", id: "B" },
      { name: "C", id: "C" },
      { name: "D", id: "D" }
    ];
  }),

  conditions: Ember.computed(function(){
    return [
      { name: "New", id: "N" },
      { name: "Mixed", id: "M" },
      { name: "Used", id: "U" },
      { name: "Broken", id: "B" }
    ];
  }),

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
      return this.get("item.isDesignated") && !this.get("item.isDispatched");
    }
  }),

  actions: {
    partialDesignateForSet() {
      this.set('designateFullSet', true);
      this.set('callOrderObserver', true);
    },

    moveItemSet() {
      if(this.get("item.isSet")) {
        if(this.get("item.setItem.canBeMoved")) {
          this.transitionToRoute('items.search_location', this.get("item.id"), { queryParams: { isSet: true }});
        } else {
          this.get("messageBox").alert("One or more items from this set are part of box or pallet. You can only move it using Stockit.");
        }
      } else {
        this.transitionToRoute('items.search_location', this.get("item.id"), { queryParams: { isSet: false, partial_qty: "" }});
      }
    },
  }

});
