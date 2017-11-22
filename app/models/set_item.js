import { computed } from '@ember/object';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import Model from 'ember-data/model';

export default Model.extend({

  description: attr('string'),
  code:        belongsTo('code', { async: false }),
  items:       hasMany('item', { async: false }),
  designatedSetItemOrderPackages: [],

  multiQuantitySet: computed('items.@each.quantity', function() {
    return this.get("items").rejectBy('quantity', 1).length > 0;
  }),

  allDesignated: computed('items.@each.designation', function() {
    return this.get("items").filterBy('designation', null).length === 0;
  }),

  sortedItems: computed('items', function() {
    return this.get("items").sortBy('id');
  }),

  allDispatched: computed('items.@each.isDispatched', function() {
    return this.get("items").filterBy('isDispatched', false).length === 0;
  }),

  designatedItems: computed('items.@each.designation', function() {
    return this.get("items").rejectBy('designation', null);
  }),

  designations: computed("items.@each.orderCode", "allDesignated", function() {
    var designatedPackages = [];
    this.get("designatedSetItemOrderPackages").forEach(designationId => {
      designatedPackages.push(this.store.peekRecord('designation', designationId));
    });
    return designatedPackages;
  }),

  shareSingleDesignation: computed("items.@each.orderCode", "allDesignated", function() {
    if(this.get("allDesignated")) {
      return this.get("items").map(a => a.get('orderCode')).uniq().length === 1;
    } else {
      return false;
    }
  }),

  hasZeroQty: computed("items.@each.ordersPackages", function() {
    var zeroQty = true;
    this.get("items").forEach(record => {
      if(record.get("quantity") === 0) {
        zeroQty = false;
      }
    });
    return zeroQty;
  }),

  hasSingleDesignation: computed("items.@each.ordersPackages", function() {
    var lessThenOneDesignation = true;
    this.get("items").forEach(record => {
      var designatedOrderPackages = record.get("ordersPackages").filterBy("state", "designated");
      if(designatedOrderPackages.get("length") > 1 || designatedOrderPackages.get("length") === 0) {
        lessThenOneDesignation = false;
      }
    });
    return lessThenOneDesignation;
  }),

  designatedAndDispatchedOrdersPackages: computed("items.@each.ordersPackages", function() {
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

  setItemOrdersPackages: computed("items.@each.ordersPackages", function() {
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

  hasSameSingleDesignation: computed("items.@each.ordersPackages", function() {
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

  canBeMoved: computed('items.@each.hasBoxPallet', function() {
    return this.get("items").filterBy('hasBoxPallet', true).length === 0;
  })
});
