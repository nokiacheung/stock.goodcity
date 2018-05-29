import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({

  status:               attr('string'),
  state:                attr('string'),
  createdAt:            attr('date'),
  recentlyUsedAt:       attr('date'),
  processedAt:          attr('date'),
  processedById:        attr('number'),
  cancelledAt:          attr('date'),
  cancelledById:        attr('number'),
  processCompletedAt:   attr('date'),
  processCompletedById: attr('number'),
  closedAt:             attr('date'),
  closedById:           attr('number'),
  code:                 attr('string'),
  activity:             attr('string'),
  description:          attr('string'),
  detailType:           attr('string'),
  detailId:             attr('number'),
  purposeDescription:   attr('string'),
  gcOrganisationId:     attr('number'),

  contact:            belongsTo('contact', { async: false }),
  organisation:       belongsTo('organisation', { async: false }),
  gcOrganisation:     belongsTo('gcOrganisation', { async: false }),
  localOrder:         belongsTo('local_order', { async: false }),
  items:              hasMany('item', { async: true }),
  ordersPackages:     hasMany('ordersPackages', { async: false }),
  orderTransport:     belongsTo('orderTransport', { async: false }),
  ordersPurposes:     hasMany('ordersPurpose', { async: false }),

  isLocalOrder: Ember.computed.equal('detailType', 'LocalOrder'),
  isGoodCityOrder: Ember.computed.equal('detailType', 'GoodCity'),

  dispatchedItems: Ember.computed('items.@each.sentOn', function() {
    return this.get("items").rejectBy('sentOn', null);
  }),

  capitalizedState: Ember.computed('state', function() {
    return this.get("state").capitalize();
  }),

  ordersPackagesCount: Ember.computed('ordersPackages.[]', 'ordersPackages.@each.quantity', 'ordersPackages.@each.state', function() {
    return this.get("ordersPackages").filterBy('quantity').length;
  }),

  allOrdersPackagesDispatched: Ember.computed('ordersPackages.@each.state', 'ordersPackages.@each.quantity', function() {
    var ordersPackages = this.get("ordersPackages").filterBy('quantity');
    return ordersPackages.length > 0 && ordersPackages.filterBy('isDispatched', false).length === 0;
  }),

  allOrdersPackagesDesignated: Ember.computed('ordersPackages.@each.state', 'ordersPackages.@each.quantity', function() {
    var ordersPackages = this.get("ordersPackages").filterBy('quantity');
    return ordersPackages.length > 0 && ordersPackages.filterBy('isDispatched', true).length === 0;
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
