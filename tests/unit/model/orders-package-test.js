import { test, moduleForModel } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('orders_package', 'OrdersPackage Model', {
  needs: ['model:item', 'model:image', 'model:donor_condition', 'model:user', 'model:designation', 'model:code']
});

test('Relationships with other models', function(assert) {
  assert.expect(4);
  var OrdersPackage = this.store().modelFor('orders_package');
  var relationshipWithItem = Ember.get(OrdersPackage, 'relationshipsByName').get('item');
  var relationshipWithDesignation = Ember.get(OrdersPackage, 'relationshipsByName').get('designation');

  assert.equal(relationshipWithItem.key, 'item');
  assert.equal(relationshipWithItem.kind, 'belongsTo');
  assert.equal(relationshipWithDesignation.key, 'designation');
  assert.equal(relationshipWithDesignation.kind, 'belongsTo');
});

test('Checking computed properties', function(assert) {
  assert.expect(2);
  var orders_package = this.subject({ state: "designated", quantity: 6 });
  assert.equal(orders_package.get('availableQty'), 6);
  assert.equal(orders_package.get('isSingleQuantity'), false);
});

test('OrdersPackage is a valid ember-data Model', function(assert) {
  assert.expect(1);

  var store  = this.store();
  var record = null;

  Ember.run(function() {
    store.createRecord('orders_package', {id: 1, state: 'designated', quantity: 5});
    record = store.peekRecord('orders_package', 1);
  });

  assert.equal(record.get('state'), 'designated');
});
