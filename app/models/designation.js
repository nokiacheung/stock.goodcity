import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';
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
  localOrder:         belongsTo('local_order', { async: false }),
  items:              hasMany('item', { async: true }),
  ordersPackages:     hasMany('ordersPackages', { async: false }),
  orderTransport:     belongsTo('orderTransport', { async: false }),
  // purposes:           hasMany('purpose', { async: false }),

  isLocalOrder: equal('detailType', 'LocalOrder'),
  isGoodCityOrder: equal('detailType', 'GoodCity'),

  dispatchedItems: computed('items.@each.sentOn', function() {
    return this.get("items").rejectBy('sentOn', null);
  }),

  allItemsDispatched: computed('items.@each.isDispatched', function() {
    var items = this.get("items");
    return items.get('length') > 0 && items.filterBy('isDispatched', false).length === 0;
  }),

  designatedOrdersPackages: computed('ordersPackages.@each.state', function() {
    return this.get("ordersPackages").filterBy('state', "designated");
  }),

  dispatchedOrdersPackages: computed('ordersPackages.@each.state', function() {
    return this.get("ordersPackages").filterBy('state', "dispatched");
  }),

  designatedItems: computed('items.@each.sentOn', function() {
    return this.get("items").filterBy('sentOn', null);
  }),

  isInactive: computed('status', function(){
    return ["Sent", "Cancelled", "Closed"].indexOf(this.get("status")) >= 0;
  })

});
