import { test, moduleForModel } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('designation', 'Designation model',{
  needs: ['model:contact', 'model:organisation', 'model:local_order', 'model:item', 'model:orders_package', 'model:location', 'model:code', 'model:donor-condition', 'model:set-item', 'model:packages-location', 'model:image']
});

test('check attributes', function(assert){

  assert.expect(8);

  var model = this.subject();
  var status = Object.keys(model.toJSON()).indexOf('status') > -1;
  var createdAt = Object.keys(model.toJSON()).indexOf('createdAt') > -1;
  var recentlyUsedAt = Object.keys(model.toJSON()).indexOf('recentlyUsedAt') > -1;
  var code = Object.keys(model.toJSON()).indexOf('code') > -1;
  var activity = Object.keys(model.toJSON()).indexOf('activity') > -1;
  var description = Object.keys(model.toJSON()).indexOf('description') > -1;
  var detailType = Object.keys(model.toJSON()).indexOf('detailType') > -1;
  var detailId = Object.keys(model.toJSON()).indexOf('detailId') > -1;

  assert.ok(status);
  assert.ok(createdAt);
  assert.ok(recentlyUsedAt);
  assert.ok(code);
  assert.ok(activity);
  assert.ok(description);
  assert.ok(detailType);
  assert.ok(detailId);

});

test('Relationships with other models', function(assert){
  assert.expect(10);
  var designation = this.store().modelFor('designation');
  var relationshipWithContact = Ember.get(designation, 'relationshipsByName').get('contact');
  var relationshipWithOrganisation = Ember.get(designation, 'relationshipsByName').get('organisation');
  var relationshipWithLocalOrder = Ember.get(designation, 'relationshipsByName').get('localOrder');
  var relationshipWithItem = Ember.get(designation, 'relationshipsByName').get('items');
  var relationshipOrdersPackage = Ember.get(designation, 'relationshipsByName').get('ordersPackages');

  assert.equal(relationshipWithContact.key, 'contact');
  assert.equal(relationshipWithContact.kind, 'belongsTo');

  assert.equal(relationshipWithOrganisation.key, 'organisation');
  assert.equal(relationshipWithOrganisation.kind, 'belongsTo');

  assert.equal(relationshipWithLocalOrder.key, 'localOrder');
  assert.equal(relationshipWithLocalOrder.kind, 'belongsTo');

  assert.equal(relationshipWithItem.key, 'items');
  assert.equal(relationshipWithItem.kind, 'hasMany');

  assert.equal(relationshipOrdersPackage.key, 'ordersPackages');
  assert.equal(relationshipOrdersPackage.kind, 'hasMany');
});

test('check isLocalOrder', function(assert){
  const model = this.subject({detailType: 'LocalOrder'});
  assert.equal(model.get('isLocalOrder'), true);
});

test('check dispatchedItems returns items with sentOn not null', function(assert){
  assert.expect(3);
  const model = this.subject();
  var store = this.store();
  var item1 = null;
  var item2 = null;
  var item3 = null;
  var despatchedItemsIds = null;

  Ember.run(function(){
    store.createRecord('item', { id: 1, sentOn: "12/07/2016" });
    store.createRecord('item', { id: 2, sentOn: "12/07/2016" });
    store.createRecord('item', { id: 3, sentOn: null });
    item1 = store.peekRecord('item', 1);
    item2 = store.peekRecord('item', 2);
    item3 = store.peekRecord('item', 3);
    model.get('items').pushObject(item1);
    model.get('items').pushObject(item2);
    model.get('items').pushObject(item3);
  });
  despatchedItemsIds = model.get('dispatchedItems').getEach('id');
  assert.equal(despatchedItemsIds.get('length'), 2);
  assert.equal(despatchedItemsIds[0], item1.get('id'));
  assert.equal(despatchedItemsIds[1], item2.get('id'));
});

test('check designatedItems returns items with sentOn null', function(assert){
  assert.expect(3);
  const model = this.subject();
  var store = this.store();
  var item1 = null;
  var item2 = null;
  var item3 = null;
  var designatedItemsIds = null;

  Ember.run(function(){
    store.createRecord('item', { id: 1, sentOn: null });
    store.createRecord('item', { id: 2, sentOn: null });
    store.createRecord('item', { id: 3, sentOn: "12/07/2016" });
    item1 = store.peekRecord('item', 1);
    item2 = store.peekRecord('item', 2);
    item3 = store.peekRecord('item', 3);
    model.get('items').pushObject(item1);
    model.get('items').pushObject(item2);
    model.get('items').pushObject(item3);
  });
  designatedItemsIds = model.get('designatedItems').getEach('id');
  assert.equal(designatedItemsIds.get('length'), 2);
  assert.equal(designatedItemsIds[0], item1.get('id'));
  assert.equal(designatedItemsIds[1], item2.get('id'));
});

test('check designatedOrdersPackages returns only designated orders_packages', function(assert){
  assert.expect(3);
  const model = this.subject();
  var store = this.store();
  var orders_package1 = null;
  var orders_package2 = null;
  var orders_package3 = null;
  var designatedOrdersPackagesIds = null;

  Ember.run(function(){
    store.createRecord('orders_package', {id: 1, state: 'designated'});
    store.createRecord('orders_package', {id: 2, state: 'designated'});
    store.createRecord('orders_package', {id: 3, state: 'dispatched'});

    orders_package1 = store.peekRecord('orders_package',1);
    orders_package2 = store.peekRecord('orders_package',2);
    orders_package3 = store.peekRecord('orders_package',3);

    model.get('ordersPackages').pushObject(orders_package1);
    model.get('ordersPackages').pushObject(orders_package2);
    model.get('ordersPackages').pushObject(orders_package3);
  });

  designatedOrdersPackagesIds = model.get('designatedOrdersPackages').getEach('id');

  assert.equal(designatedOrdersPackagesIds.get('length'),2);
  assert.equal(designatedOrdersPackagesIds[0], orders_package1.get('id'));
  assert.equal(designatedOrdersPackagesIds[1], orders_package2.get('id'));
});

test('check dispatchedOrdersPackages returns only dispatched orders_packages', function(assert){
  assert.expect(3);
  const model = this.subject();
  var store = this.store();
  var orders_package1 = null;
  var orders_package2 = null;
  var orders_package3 = null;
  var dispatchedOrdersPackagesIds = null;

  Ember.run(function(){
    store.createRecord('orders_package', {id: 1, state: 'dispatched'});
    store.createRecord('orders_package', {id: 2, state: 'dispatched'});
    store.createRecord('orders_package', {id: 3, state: 'designated'});

    orders_package1 = store.peekRecord('orders_package',1);
    orders_package2 = store.peekRecord('orders_package',2);
    orders_package3 = store.peekRecord('orders_package',3);

    model.get('ordersPackages').pushObject(orders_package1);
    model.get('ordersPackages').pushObject(orders_package2);
    model.get('ordersPackages').pushObject(orders_package3);
  });

  dispatchedOrdersPackagesIds = model.get('dispatchedOrdersPackages').getEach('id');

  assert.equal(dispatchedOrdersPackagesIds.get('length'),2);
  assert.equal(dispatchedOrdersPackagesIds[0], orders_package1.get('id'));
  assert.equal(dispatchedOrdersPackagesIds[1], orders_package2.get('id'));
});

test('check allItemsDispatched returns true if all Items are dispatched otherwise returns false', function(assert){
  assert.expect(2);
  var store = this.store();
  var item1 = null;
  var item2 = null;
  var item3 = null;
  var unDispatcheditem = null;
  var designation1 = null;
  var designation2 = null;

  Ember.run(function(){

    store.createRecord('designation', {
      id:               5,
      detailType:       'StockitLocalOrder',
      status:           'Active',
      createdAt:        '12/07/2016',
      updatedAt:        '12/07/2016'
    });

    store.createRecord('designation', {
      id:               6,
      detailType:       'StockitLocalOrder',
      status:           'Active',
      createdAt:        '12/07/2016',
      updatedAt:        '12/07/2016'
    });

    store.createRecord('item', { id: 1, isDispatched: true });
    store.createRecord('item', { id: 2, isDispatched: true });
    store.createRecord('item', { id: 3, isDispatched: true });
    store.createRecord('item', { id: 4, isDispatched: false });

    designation1 = store.peekRecord('designation', 5);
    designation2 = store.peekRecord('designation', 6);

    item1 = store.peekRecord('item', 1);
    item2 = store.peekRecord('item', 2);
    item3 = store.peekRecord('item', 3);
    unDispatcheditem = store.peekRecord('item', 4);


    designation1.get('items').pushObject(item1);
    designation1.get('items').pushObject(item2);

    designation2.get('items').pushObject(item3);
    designation2.get('items').pushObject(unDispatcheditem);

  });
  assert.equal(designation1.get('allItemsDispatched'), true);
  assert.equal(designation2.get('allItemsDispatched'), false);
});

test('check isInactive', function(assert){
  var store = this.store();
  var designation = null;

  Ember.run(function(){
    store.createRecord('designation', {
      id:               4,
      detailType:       'StockitLocalOrder',
      status:           'Sent',
      createdAt:        '12/07/2016',
      updatedAt:        '12/07/2016'
    });

    designation = store.peekRecord('designation', 4);
  });
  assert.equal(designation.get('isInactive'), true);
});
