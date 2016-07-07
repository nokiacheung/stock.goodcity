import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import '../factories/user_profile';
import FactoryGuy from 'ember-data-factory-guy';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';

var App, hk_user, non_hk_user;

module('Acceptance: Login', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();

    hk_user = FactoryGuy.make('with_hk_mobile');
    non_hk_user = FactoryGuy.make('with_non_hk_mobile');

    lookup("controller:subscriptions").pusher = {
      get: function() { return {}; },
      wire: function() {}
    };
  },
  afterEach: function() {
    Ember.run(function () { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test("User able to enter mobile number and get the sms code", function() {
  expect(1);
  fillIn('#mobile', hk_user.get("mobile"));
  triggerEvent('#mobile', 'blur');
  click("#getsmscode");

  andThen(function() {
    equal(currentURL(), "/authenticate");
  });
});

test("User is able to enter sms code and confirm and redirected to orders", function() {
  expect(2);

  var authToken = window.localStorage.authToken;
  visit('/authenticate');
  fillIn('#pin', "1234");
  triggerEvent('#pin', 'blur');

  andThen(function() {
    equal(find('#pin').val().length, 4);
    window.localStorage.authToken = authToken;
  });

  click("#submit_pin");

  andThen(function(){
    equal(currentURL(), "/orders/index");
  });
});


test("User is able to resend the sms code", function() {
  expect(1);

  $.mockjax({url:"/api/v1/auth/send_pi*",responseText:{
    "otp_auth_key" : "/JqONEgEjrZefDV3ZIQsNA=="
  }});

  visit('/authenticate');

  click("#resend-pin");

  andThen(function() {
    equal(window.localStorage.otpAuthKey, '"/JqONEgEjrZefDV3ZIQsNA=="');
  });

});
