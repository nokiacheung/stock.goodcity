import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import Model from 'ember-data/model';
import Ember from 'ember';

export default Model.extend({

  description: attr('string'),
  code:        belongsTo('code', { async: false }),
  items:       hasMany('item', { async: false }),
  designatedSetItemOrderPackages: [],

  multiQuantitySet: Ember.computed('items.@each.quantity', function() {
    return this.get("items").rejectBy('quantity', 1).length > 0;
  }),

  allDesignated: Ember.computed('items.@each.designation', function() {
    return this.get("items").filterBy('designation', null).length === 0;
  }),

  sortedItems: Ember.computed('items', function() {
    return this.get("items").sortBy('id');
  }),

  allDispatched: Ember.computed('items.@each.isDispatched', function() {
    return this.get("items").filterBy('isDispatched', false).length === 0;
  }),

  designatedItems: Ember.computed('items.@each.designation', function() {
    return this.get("items").rejectBy('designation', null);
  }),

  designations: Ember.computed("items.@each.orderCode", "allDesignated", function() {
    var designatedPackages = [];
    this.get("designatedSetItemOrderPackages").forEach(designationId => {
      designatedPackages.push(this.store.peekRecord('designation', designationId));
    });
    return designatedPackages;
  }),

  shareSingleDesignation: Ember.computed("items.@each.orderCode", "allDesignated", function() {
    if(this.get("allDesignated")) {
      return this.get("items").map(a => a.get('orderCode')).uniq().length === 1;
    } else {
      return false;
    }
  }),

  hasZeroQty: Ember.computed("items.@each.ordersPackages", function() {
    var zeroQty = true;
    this.get("items").forEach(record => {
      if(record.get("quantity") === 0) {
        zeroQty = false;
      }
    });
    return zeroQty;
  }),

  hasSingleDesignation: Ember.computed("items.@each.ordersPackages", function() {
    var lessThenOneDesignation = true;
    this.get("items").forEach(record => {
      var designatedOrderPackages = record.get("ordersPackages").filterBy("state", "designated");
      if(designatedOrderPackages.get("length") > 1 || designatedOrderPackages.get("length") === 0) {
        lessThenOneDesignation = false;
      }
    });
    return lessThenOneDesignation;
  }),

  designatedAndDispatchedOrdersPackages: Ember.computed("items.@each.ordersPackages", function() {
    var designatedAndDispatchedPackages = [];
    this.get("items").forEach(record => {
      var orderPackages = record.get("ordersPackages").filterBy("quantity");
      orderPackages.forEach(record => {
        if(record && record.get("state") !== "cancelled") {
          designatedAndDispatchedPackages.push(record);
        }
      });
    });
    return designatedAndDispatchedPackages;
  }),

  setItemOrdersPackages: Ember.computed("items.@each.ordersPackages", function() {
    var designatedAndDispatchedPackages = [];
    this.get("items").forEach(record => {
      var orderPackages = record.get("ordersPackages").filterBy("quantity");
      orderPackages.forEach(record => {
        if(record && record.get("state") !== "cancelled") {
          designatedAndDispatchedPackages.push(record);
        }
      });
    });
    return designatedAndDispatchedPackages.get("length");
  }),

  hasSameSingleDesignation: Ember.computed("items.@each.ordersPackages", function() {
    var sameSingleDesignation = true;
    var designatedPackages = [];
    this.get("items").forEach(record => {
      var designatedOrderPackages = record.get("ordersPackages").filterBy("state", "designated");
      if(designatedOrderPackages.get("length") === 1) {
        designatedPackages.push(designatedOrderPackages[0].get("designationId"));
      }
    });
    designatedPackages.forEach(record => {
      if(record !== designatedPackages[0]) {
        sameSingleDesignation = false;
      }
    });
    this.set("designatedSetItemOrderPackages", designatedPackages);
    return (designatedPackages.get("length") === this.get("items.length") && sameSingleDesignation) ? true : false;
  }),

  canBeMoved: Ember.computed('items.@each.hasBoxPallet', function() {
    return this.get("items").filterBy('hasBoxPallet', true).length === 0;
  })
});
