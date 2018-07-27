import { test, moduleForModel } from 'ember-qunit';

moduleForModel('contact', 'Contact model',{
  need:[]
});

test('check attributes', function(assert){
  var model = this.subject();
  var mobile = Object.keys(model.toJSON()).indexOf('mobile') > -1;
  var name = Object.keys(model.toJSON()).indexOf('name') > -1;

  assert.ok(mobile);
  assert.ok(name);
});
