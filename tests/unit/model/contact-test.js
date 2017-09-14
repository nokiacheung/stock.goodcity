import { test, moduleForModel } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('contact', 'Contact model',{
  need:[]
});

test('check attributes', function(assert){
  var model = this.subject();
  var firstName = Object.keys(model.toJSON()).indexOf('firstName') > -1;
  var lastName = Object.keys(model.toJSON()).indexOf('lastName') > -1;
  var phoneNumber = Object.keys(model.toJSON()).indexOf('phoneNumber') > -1;
  var mobilePhoneNumber = Object.keys(model.toJSON()).indexOf('mobilePhoneNumber') > -1;

  assert.ok(firstName);
  assert.ok(lastName);
  assert.ok(phoneNumber);
  assert.ok(mobilePhoneNumber);
});

test('check displayNumber computedProperty', function(assert){
  var model = this.subject();
  Ember.run(function() {
    model.set('mobilePhoneNumber', '885588556');
  });

  assert.equal(model.get('displayNumber'), '885588556');
});

test('check fullName computedProperty', function(assert){
  var model = this.subject();
  Ember.run(function() {
    model.set('firstName', 'Jonh');
    model.set('lastName', 'Cena');
  });

  assert.equal(model.get('fullName'), 'Jonh Cena');
});
