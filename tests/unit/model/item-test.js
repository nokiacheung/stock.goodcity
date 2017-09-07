import { test, moduleForModel } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('item', 'Item Model', {
  needs: ['model:item', 'model:designation', 'model:location', 'model:code', 'model:donor_condition', 'model:set_item', 'model:packages_location', 'model:orders_package', 'model:image']
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
