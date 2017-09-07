import { test, moduleForModel } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('district', 'District Model', {
  needs: ['model:territory']
});

test('Relationships with other models', function(assert) {
  assert.expect(2);
  var District = this.store().modelFor('district');
  var relationshipWithTerritory = Ember.get(District, 'relationshipsByName').get('territory');

  assert.equal(relationshipWithTerritory.key, 'territory');
  assert.equal(relationshipWithTerritory.kind, 'belongsTo');
});
