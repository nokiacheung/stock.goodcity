import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({

  status:             attr('string'),
  createdAt:          attr('date'),
  recentlyUsedAt:     attr('date'),
  code:               attr('string'),
  activity:           attr('string'),
  description:        attr('string'),
  detailType:         attr('string'),
  detailId:           attr('number'),

  contact:            belongsTo('contact', { async: false }),
  organisation:       belongsTo('organisation', { async: false }),
  gcOrganisation:     belongsTo('gcOrganisation', { async: false }),
  localOrder:         belongsTo('local_order', { async: false }),
  items:              hasMany('item', { async: true }),
  ordersPackages:     hasMany('ordersPackages', { async: false }),
  orderTransport:     belongsTo('orderTransport', { async: false }),
  // purposes:           hasMany('purpose', { async: false }),

  isLocalOrder: Ember.computed.equal('detailType', 'LocalOrder'),
  isGoodCityOrder: Ember.computed.equal('detailType', 'GoodCity'),

  dispatchedItems: Ember.computed('items.@each.sentOn', function() {
    return this.get("items").rejectBy('sentOn', null);
  }),

  allItemsDispatched: Ember.computed('items.@each.isDispatched', function() {
    var items = this.get("items");
    return items.get('length') > 0 && items.filterBy('isDispatched', false).length === 0;
  }),

  designatedOrdersPackages: Ember.computed('ordersPackages.@each.state', function() {
    return this.get("ordersPackages").filterBy('state', "designated");
  }),

  dispatchedOrdersPackages: Ember.computed('ordersPackages.@each.state', function() {
    return this.get("ordersPackages").filterBy('state', "dispatched");
  }),

  designatedItems: Ember.computed('items.@each.sentOn', function() {
    return this.get("items").filterBy('sentOn', null);
  }),

  isInactive: Ember.computed('status', function(){
    return ["Sent", "Cancelled", "Closed"].indexOf(this.get("status")) >= 0;
  })

});
