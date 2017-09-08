import { test, moduleForModel } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('image', 'Image Model', {
  needs: ['model:item']
});

test('Relationships with other models', function(assert) {
  assert.expect(2);
  var Image = this.store().modelFor('image');
  var relationshipWithItem = Ember.get(Image, 'relationshipsByName').get('item');

  assert.equal(relationshipWithItem.key, 'item');
  assert.equal(relationshipWithItem.kind, 'belongsTo');
});
