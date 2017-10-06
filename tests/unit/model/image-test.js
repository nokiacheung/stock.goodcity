import { test, moduleForModel } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('image', 'Image Model', {
  needs: ['model:item']
});

test('check attributess', function(assert){
  assert.expect(6);

  var model = this.subject();
  var favourite = Object.keys(model.toJSON()).indexOf('favourite') > -1;
  var cloudinaryId = Object.keys(model.toJSON()).indexOf('cloudinaryId') > -1;
  var angle = Object.keys(model.toJSON()).indexOf('angle') > -1;
  var itemId = Object.keys(model.toJSON()).indexOf('itemId') > -1;
  var imageableId = Object.keys(model.toJSON()).indexOf('imageableId') > -1;
  var imageableType = Object.keys(model.toJSON()).indexOf('imageableType') > -1;

  assert.ok(favourite);
  assert.ok(cloudinaryId);
  assert.ok(angle);
  assert.ok(itemId);
  assert.ok(imageableId);
  assert.ok(imageableType);
});

test('Relationships with other models', function(assert) {
  assert.expect(2);
  var Image = this.store().modelFor('image');
  var relationshipWithItem = Ember.get(Image, 'relationshipsByName').get('item');

  assert.equal(relationshipWithItem.key, 'item');
  assert.equal(relationshipWithItem.kind, 'belongsTo');
});
