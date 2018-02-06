import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import '../factories/user';
import FactoryGuy from 'ember-data-factory-guy';

var App, hk_user, non_hk_user;

module('Acceptance: Login', {
  beforeEach: function() {
    App = startApp({}, 2);

    hk_user = FactoryGuy.make('with_hk_mobile');
    non_hk_user = FactoryGuy.make('with_non_hk_mobile');
    window.localStorage.removeItem('authToken');

  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test("User able to enter mobile number and get the sms code", function(assert) {
  assert.expect(1);
  $.mockjax({url:"/api/v1/auth/send_pi*",responseText:{
    "otp_auth_key" : "/JqONEgEjrZefDV3ZIQsNA=="
  }});
  visit('/login');
  fillIn('#mobile', hk_user.get("mobile"));
  triggerEvent('#mobile', 'blur');
  click("#getsmscode");

  andThen(function() {
    assert.equal(currentURL(), "/authenticate");
  });
});

test("User is able to resend the sms code", function(assert) {
  assert.expect(1);

  $.mockjax({url:"/api/v1/auth/send_pi*",responseText:{
    "otp_auth_key" : "/JqONEgEjrZefDV3ZIQsNA=="
  }});

  visit('/authenticate');

  click("#resend-pin");

  andThen(function() {
    assert.equal(window.localStorage.otpAuthKey, '"/JqONEgEjrZefDV3ZIQsNA=="');
  });

});
