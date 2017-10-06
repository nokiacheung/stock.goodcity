import { test, moduleForModel } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('addressable', 'Addressable model',{
  needs: ['model:address']
});

test('Relationships with other models', function(assert){
  assert.expect(2);
  var Addressable = this.store().modelFor('Addressable');
  var relationshipWithAddress =Ember.get(Addressable, 'relationshipsByName').get('address');

  assert.equal(relationshipWithAddress.key, 'address');
  assert.equal(relationshipWithAddress.kind, 'belongsTo');
});
