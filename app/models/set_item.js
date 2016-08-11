import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import Model from 'ember-data/model';
import Ember from 'ember';

export default Model.extend({

  description: attr('string'),
  code:        belongsTo('code', { async: false }),
  items:       hasMany('item', { async: false }),

  multiQuantitySet: Ember.computed('items.@each.quantity', function() {
    return this.get("items").rejectBy('quantity', 1).length > 0;
  }),

  allDesignated: Ember.computed('items.@each.designation', function() {
    return this.get("items").filterBy('designation', null).length === 0;
  }),

  allDispatched: Ember.computed('items.@each.isDispatched', function() {
    return this.get("items").filterBy('isDispatched', false).length === 0;
  }),

  designatedItems: Ember.computed('items.@each.designation', function() {
    return this.get("items").rejectBy('designation', null);
  }),

  designations: Ember.computed("items.@each.orderCode", "allDesignated", function() {
    return this.get("designatedItems").map(a => a.get('designation')).uniq();
  }),

  shareSingleDesignation: Ember.computed("items.@each.orderCode", "allDesignated", function() {
    if(this.get("allDesignated")) {
      return this.get("items").map(a => a.get('orderCode')).uniq().length === 1;
    } else {
      return false;
    }
  }),


});
