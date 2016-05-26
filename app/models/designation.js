import DS from 'ember-data';
import Ember from 'ember';

var attr = DS.attr,
    belongsTo = DS.belongsTo,
    hasMany = DS.hasMany;

export default DS.Model.extend({

  status:       attr('string'),
  createdAt:    attr('date'),
  code:         attr('string'),
  detailType:   attr('string'),
  detailId:     attr('number'),

  contact:      belongsTo('contact', { async: false }),
  organisation: belongsTo('organisation', { async: false }),
  localOrder:   belongsTo('local_order', { async: false }),
  items:        hasMany('item', { async: false }),

  dispatchedItems: Ember.computed('items.@each.sentOn', function() {
    return this.get("items").rejectBy('sentOn', null);
  }),

  designatedItems: Ember.computed('items.@each.sentOn', function() {
    return this.get("items").filterBy('sentOn', null);
  }),

});
