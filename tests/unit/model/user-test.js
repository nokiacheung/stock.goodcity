import { test, moduleForModel } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('user', 'User Model', {
  needs: ['model:permission', 'model:user']
});

test('Relationships with other models', function(assert) {
  assert.expect(2);
  var User = this.store().modelFor('user');
  var relationshipWithPermission = Ember.get(User, 'relationshipsByName').get('permission');

  assert.equal(relationshipWithPermission.key, 'permission');
  assert.equal(relationshipWithPermission.kind, 'belongsTo');
});

