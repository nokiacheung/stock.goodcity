import { test, moduleForModel } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('packages_location', 'PackagesLocation Model', {
  needs: ['model:item', 'model:image', 'model:donor_condition', 'model:user', 'model:designation', 'model:code', 'model:location']
});

test('PackagesLocation is a valid ember-data Model', function (assert) {
  assert.expect(1);

  var store  = this.store();
  var record = null;

  Ember.run(function() {
    store.createRecord('packages_location', {id: 1, quantity: 5});
    record = store.peekRecord('packages_location', 1);
  });

  assert.equal(record.get('quantity'), 5);
});
