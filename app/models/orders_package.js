import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  packageId: attr('number'),
  orderId: attr('number'),
  itemId: attr('number'),
  designationId: attr('number'),
  quantity: attr('number'),
  sentOn: attr('date'),
  state: attr('string'),

  item:    belongsTo('item', { async: true }),
  designation:    belongsTo('designation', { async: true }),
  isDispatched: Ember.computed.bool('sentOn'),

  isRequested: Ember.computed.equal("state", "requested"),
  isDesignated: Ember.computed.equal("state", "designated"),
  isDispatched: Ember.computed.equal("state", "dispatched"),
  isCancelled: Ember.computed.equal("state", "cancelled"),

  availableQty: Ember.computed("quantity", function() {
    return this.get('quantity');
  }),

  qtyToModify: Ember.computed("quantity", "item.quantity", function() {
    return this.get('quantity') + this.get("item.quantity");
  }),

  orderCode: Ember.computed("designation", function(){
    return this.get('designation.code');
  }),

  isSingleQuantity: Ember.computed('quantity', function(){
    return this.get('quantity') === 1;
  })
});
