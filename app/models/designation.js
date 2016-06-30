import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({

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
