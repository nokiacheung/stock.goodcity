import { test, moduleForModel } from 'ember-qunit';

moduleForModel('donor_condition', 'DonorCondition model',{
  needs: []
});

test('check attributes', function(assert){
  var model = this.subject();
  var name = Object.keys(model.toJSON()).indexOf('name') > -1;

  assert.ok(name);
});
