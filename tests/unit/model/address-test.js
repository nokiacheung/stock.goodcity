import { test, moduleForModel } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('address', 'Address model',{
  needs: ['model:addressable']
});

test('Relationships with other models', function(assert){
  assert.expect(2);
  var Address = this.store().modelFor('Address');
  var relationshipWithAddressable =Ember.get(Address, 'relationshipsByName').get('addressable');

  assert.equal(relationshipWithAddressable.key, 'addressable');
  assert.equal(relationshipWithAddressable.kind, 'belongsTo');
});
