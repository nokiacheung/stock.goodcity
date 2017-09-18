import { test, moduleForModel } from 'ember-qunit';
// import Ember from 'ember';

moduleForModel('set_item', 'SetItem model',{
  needs: ['model:code','model:item']
});

test('check attributes', function(assert){
  assert.expect(1);
  var model = this.subject();
  var description = Object.keys(model.toJSON()).indexOf('description') > -1;

  assert.ok(description);
});

// test('Relationships with other models', function(assert){
//   assert.expect(4);
//   var set_item = this.store().modelFor('SetItem');
//   var relationshipWithCode = Ember.get(set_item, 'relationshipsByName').get('code');
//   var relationshipWithItem = Ember.get(set_item, 'relationshipsByName').get('item');

//   assert.equal(relationshipWithCode.key, 'code');
//   assert.equal(relationshipWithCode.kind, 'belongsTo');
//   assert.equal(relationshipWithItem.key, 'item');
//   assert.equal(relationshipWithItem.kind, 'hasMany');
// });
