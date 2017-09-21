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
  const model = this.subject();
  Ember.run(function(){
    model.set('detailType', 'LocalOrder');
  });
  assert.equal(model.get('isLocalOrder'), true);
});

test('check dispatchedItems returns items with sentOn not null', function(assert){
  assert.expect(4);
  const model = this.subject();
  var store = this.store();
  var item1 = null;
  var item2 = null;
  var item3 = null;
  var despatchedItems = null;

  Ember.run(function(){
    store.createRecord('item', { id: 1, sentOn: "not null" });
    store.createRecord('item', { id: 2, sentOn: "not null" });
    store.createRecord('item', { id: 3, sentOn: null });
    item1 = store.peekRecord('item', 1);
    item2 = store.peekRecord('item', 2);
    item3 = store.peekRecord('item', 3);
    model.get('items').pushObject(item1);
    model.get('items').pushObject(item2);
    model.get('items').pushObject(item3);
  });
  despatchedItems = model.get('dispatchedItems').getEach('id');
  assert.equal(despatchedItems[0], item1.get('id'));
  assert.equal(despatchedItems[1], item2.get('id'));
  assert.equal(despatchedItems[2], null); //item3 won't come in cause sentOn for item3 is null
  assert.equal(despatchedItems.get('length'), 2);
});
