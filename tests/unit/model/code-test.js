import { test, moduleForModel } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('code', 'Code model',{
  needs: ['model:location']
});

test('check attributes', function(assert){
  assert.expect(5);
  var model = this.subject();
  var name = Object.keys(model.toJSON()).indexOf('name') > -1;
  var code = Object.keys(model.toJSON()).indexOf('code') > -1;
  var visibleInSelects = Object.keys(model.toJSON()).indexOf('visibleInSelects') > -1;
  var defaultChildPackages = Object.keys(model.toJSON()).indexOf('defaultChildPackages') > -1;
  var otherChildPackages = Object.keys(model.toJSON()).indexOf('otherChildPackages') > -1;

  assert.ok(name);
  assert.ok(code);
  assert.ok(visibleInSelects);
  assert.ok(defaultChildPackages);
  assert.ok(otherChildPackages);
});

test('Relationship with other models', function(assert){
  assert.expect(2);
  var Code = this.store().modelFor('code');
  var relationshipWithLocation = Ember.get(Code, 'relationshipsByName').get('location');

  assert.equal(relationshipWithLocation.key, 'location');
  assert.equal(relationshipWithLocation.kind, 'belongsTo');
});
