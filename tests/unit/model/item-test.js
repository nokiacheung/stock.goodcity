import { test, moduleForModel } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('item', 'Item Model', {
  needs: ['model:item', 'model:designation', 'model:location', 'model:code', 'model:donor_condition', 'model:set_item', 'model:packages_location', 'model:orders_package', 'model:image']
});

test('check attributes', function(assert){
  assert.expect(14);
  var model = this.subject();
  var notes = Object.keys(model.toJSON()).indexOf('notes') > -1;
  var grade = Object.keys(model.toJSON()).indexOf('grade') > -1;
  var inventoryNumber = Object.keys(model.toJSON()).indexOf('inventoryNumber') > -1;
  var caseNumber = Object.keys(model.toJSON()).indexOf('caseNumber') > -1;
  var quantity = Object.keys(model.toJSON()).indexOf('quantity') > -1;
  var receivedQuantity = Object.keys(model.toJSON()).indexOf('receivedQuantity') > -1;
  var length = Object.keys(model.toJSON()).indexOf('length') > -1;
  var width = Object.keys(model.toJSON()).indexOf('width') > -1;
  var height = Object.keys(model.toJSON()).indexOf('height') > -1;
  var sentOn = Object.keys(model.toJSON()).indexOf('sentOn') > -1;
  var isSet = Object.keys(model.toJSON()).indexOf('isSet') > -1;
  var hasBoxPallet = Object.keys(model.toJSON()).indexOf('hasBoxPallet') > -1;
  var itemId = Object.keys(model.toJSON()).indexOf('itemId') > -1;
  var allowWebPublish = Object.keys(model.toJSON()).indexOf('allowWebPublish') > -1;

  assert.ok(notes);
  assert.ok(grade);
  assert.ok(inventoryNumber);
  assert.ok(caseNumber);
  assert.ok(quantity);
  assert.ok(receivedQuantity);
  assert.ok(length);
  assert.ok(width);
  assert.ok(height);
  assert.ok(sentOn);
  assert.ok(isSet);
  assert.ok(hasBoxPallet);
  assert.ok(itemId);
  assert.ok(allowWebPublish);
});

test('Relationships with other models', function(assert) {
  assert.expect(16);
  var Item = this.store().modelFor('item');
  var relationshipWithDesignation = Ember.get(Item, 'relationshipsByName').get('designation');
  var relationshipWithLocation = Ember.get(Item, 'relationshipsByName').get('location');
  var relationshipWithCode = Ember.get(Item, 'relationshipsByName').get('code');
  var relationshipWithDonorCondition = Ember.get(Item, 'relationshipsByName').get('donorCondition');
  var relationshipWithSetItem = Ember.get(Item, 'relationshipsByName').get('setItem');
  var relationshipWithPkgsLocation = Ember.get(Item, 'relationshipsByName').get('packagesLocations');
  var relationshipWithOrdersPkgs = Ember.get(Item, 'relationshipsByName').get('ordersPackages');
  var relationshipWithImage = Ember.get(Item, 'relationshipsByName').get('images');

  assert.equal(relationshipWithDesignation.key, 'designation');
  assert.equal(relationshipWithDesignation.kind, 'belongsTo');

  assert.equal(relationshipWithLocation.key, 'location');
  assert.equal(relationshipWithLocation.kind, 'belongsTo');

  assert.equal(relationshipWithCode.key, 'code');
  assert.equal(relationshipWithCode.kind, 'belongsTo');

  assert.equal(relationshipWithDonorCondition.key, 'donorCondition');
  assert.equal(relationshipWithDonorCondition.kind, 'belongsTo');

  assert.equal(relationshipWithSetItem.key, 'setItem');
  assert.equal(relationshipWithSetItem.kind, 'belongsTo');

  assert.equal(relationshipWithPkgsLocation.key, 'packagesLocations');
  assert.equal(relationshipWithPkgsLocation.kind, 'hasMany');

  assert.equal(relationshipWithOrdersPkgs.key, 'ordersPackages');
  assert.equal(relationshipWithOrdersPkgs.kind, 'hasMany');

  assert.equal(relationshipWithImage.key, 'images');
  assert.equal(relationshipWithImage.kind, 'hasMany');
});

test("check available_qty computed property", function(assert){
  var model = this.subject();

  Ember.run(function(){
    model.set('available_qty', 2);
  });

  assert.equal(model.get("available_qty"), 2);
});

test("check validUndispatchedLocations computed property", function(assert){
  assert.expect(2);
  var model, store, location1, location2, packageLocation1, packageLocation2, validUndispatchedLocationsIds;
  model = this.subject();
  store = this.store();

  Ember.run(function(){
    location1 = store.createRecord('location',{id: 1, building: "11", area: "A"});
    location2 = store.createRecord('location',{id: 2, building: "Dispatched", area: "B"});
    packageLocation1 = store.createRecord('packagesLocation', {id: 1, quantity: 1, locationId: 1});
    packageLocation2 = store.createRecord('packagesLocation', {id: 2, quantity: 2, locationId: 2});
    model.get('packagesLocations').pushObjects([packageLocation1, packageLocation2]);
  });

  validUndispatchedLocationsIds = model.get('validUndispatchedLocations').getEach('id');
  assert.equal(validUndispatchedLocationsIds.get('length'), 1);
  assert.equal(Ember.compare(validUndispatchedLocationsIds, [packageLocation1.get("id")]), 0);
});
