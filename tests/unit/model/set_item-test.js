import { test, moduleForModel } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('set_item', 'SetItem model',{
  needs: ['model:code','model:item']
});

test('check attributes', function(assert){
  assert.expect(1);
  var model = this.subject();
  var description = Object.keys(model.toJSON()).indexOf('description') > -1;

  assert.ok(description);
});

test('Relationships with other models', function(assert) {
  assert.expect(4);
  var SetItem = this.store().modelFor('set_item');
  var relationshipWithCode = Ember.get(SetItem, 'relationshipsByName').get('code');
  var relationshipWithItem = Ember.get(SetItem, 'relationshipsByName').get('items');

  assert.equal(relationshipWithCode.key, 'code');
  assert.equal(relationshipWithCode.kind, 'belongsTo');
  assert.equal(relationshipWithItem.key, 'items');
  assert.equal(relationshipWithItem.kind, 'hasMany');
});
