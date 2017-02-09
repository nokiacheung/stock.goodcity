import { test, moduleForModel } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('orders_package', 'OrdersPackage Model', {
  needs: ['model:item', 'model:image', 'model:donor_condition', 'model:user', 'model:designation', 'model:code']
});

test('OrdersPackage is a valid ember-data Model', function (assert) {
  assert.expect(1);

  var store  = this.store();
  var record = null;

  Ember.run(function() {
    store.createRecord('orders_package', {id: 1, state: 'designated', quantity: 5});
    record = store.peekRecord('orders_package', 1);
  });

  assert.equal(record.get('state'), 'designated');
});
