import { test, moduleForModel } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('user', 'User Model', {
  needs: ['model:permission', 'model:user', 'model:address']
});

test('check attributes', function(assert){
  assert.expect(4);
  var model = this.subject();
  var firstName = Object.keys(model.toJSON()).indexOf('firstName') > -1;
  var lastName = Object.keys(model.toJSON()).indexOf('lastName') > -1;
  var mobile = Object.keys(model.toJSON()).indexOf('mobile') > -1;
  var createdAt = Object.keys(model.toJSON()).indexOf('createdAt') > -1;

  assert.ok(firstName);
  assert.ok(lastName);
  assert.ok(mobile);
  assert.ok(createdAt);
});

test('Relationships with other models', function(assert) {
  assert.expect(2);
  var User = this.store().modelFor('user');
  var relationshipWithPermission = Ember.get(User, 'relationshipsByName').get('permission');

  assert.equal(relationshipWithPermission.key, 'permission');
  assert.equal(relationshipWithPermission.kind, 'belongsTo');
});

