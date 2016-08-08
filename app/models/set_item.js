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

});
