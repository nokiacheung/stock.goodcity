import { debounce } from '@ember/runloop';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import config from '../../config/environment';

export default Controller.extend({
  isMobileApp: config.cordova.enabled,
  item: alias("model"),
  backLinkPath: "",
  queryParams: ['showDispatchOverlay'],
  showDispatchOverlay: false,
  autoDisplayOverlay: false,
  messageBox: service(),
  displayScanner: false,
  designateFullSet: computed.localStorage(),
  callOrderObserver: false,

  grades: computed('item.grade', function(){
    return [
      { name: "A", id: "A" },
      { name: "B", id: "B" },
      { name: "C", id: "C" },
      { name: "D", id: "D" }
    ];
  }),

  conditions: computed('item.donorCondition', function(){
    return [
      { name: "New", id: "N" },
      { name: "Mixed", id: "M" },
      { name: "Used", id: "U" },
      { name: "Broken", id: "B" }
    ];
  }),

  itemMarkedMissing: observer('item.inventoryNumber', function() {
    if(!this.get('item.inventoryNumber') && this.get("target").currentPath === "items.detail") {
      this.get('messageBox').alert("This item is not inventoried yet or has been marked as missing.", () => {
        this.transitionToRoute("items.index");
      });
    }
  }),

  performDispatch: observer("showDispatchOverlay", function() {
    debounce(this, this.updateAutoDisplayOverlay, 100);
  }),

  updateAutoDisplayOverlay() {
    if (this.get("showDispatchOverlay")) {
      this.toggleProperty('autoDisplayOverlay');
    }
  },

  allDispatched: computed("item.{isDispatched,isSet,setItem.items.@each.isDispatched}", function() {
    if(this.get("item.isSet")) {
      return this.get("item.setItem.allDispatched");
    } else {
      return this.get("item.isDispatched");
    }
  }),

  hasDesignation: computed("item.{isDesignated,isSet,setItem.items.@each.isDesignated}", function() {
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
        this.transitionToRoute('items.search_location', this.get("item.id"), { queryParams: { isSet: false, isPartialMove: false}});
      }
    }
  }
});
