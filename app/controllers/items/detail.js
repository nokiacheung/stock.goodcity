import Ember from "ember";
import config from '../../config/environment';

export default Ember.Controller.extend({
  isMobileApp: config.cordova.enabled,
  item: Ember.computed.alias("model"),
  backLinkPath: "",
  queryParams: ['showDispatchOverlay', 'caseNumber'],
  showDispatchOverlay: false,
  autoDisplayOverlay: false,
  messageBox: Ember.inject.service(),
  displayScanner: false,

  caseNumberStr: Ember.observer('caseNumber', function() {
    this.get('item').set('caseNumber', this.get('caseNumber'));
  }),

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
      { name: "New", id: '1' },
      { name: "Lightly Used", id: '2' },
      { name: "Heavily Used", id: '3' },
      { name: "Broken", id: '4' }
    ];
  }),

  itemGrade: Ember.computed ('item.grade', function() {
    var itemGrade = this.get("item.grade");
    return { id: `${itemGrade}` };
  }),

  itemCondition: Ember.computed('item.donorCondition', function() {
    var itemCondition = this.get('item.donorCondition');
    return { id: `${itemCondition.get('id')}` };
  }),

  displayScanner: false,

  caseNumberStr: Ember.observer('caseNumber', function() {
    this.get('item').set('caseNumber', this.get('caseNumber'));
  }),

  itemGrade: Ember.computed ('item.grade', function() {
    var itemGrade = this.get("item.grade");
    return { name: `${itemGrade}`, id: `${itemGrade}` };
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

  description: Ember.computed("item.notes", {
    get() {
      return this.get("item.notes");
    },
    set(key, value) {
      return value;
    }
  }),


  actions: {
    clearDescription() {
      this.set("description", '');
    },

    moveItemSet() {
      if(this.get("item.isSet")) {
        if(this.get("item.setItem.canBeMoved")) {
          this.transitionToRoute('items.search_location', this.get("item.id"), { queryParams: { isSet: true }});
        } else {
          this.get("messageBox").alert("One or more items from this set are part of box or pallet. You can only move it using Stockit.");
        }
      } else {
        this.transitionToRoute('items.search_location', this.get("item.id"), { queryParams: { isSet: false }});
      }
    },
  }

});
