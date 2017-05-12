import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import '../factories/item';
import '../factories/location';
import '../factories/package_type';
import FactoryGuy from 'ember-data-factory-guy';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';
import { mockFindAll } from 'ember-data-factory-guy';

var App, pkg;

module('Acceptance: Select PackageType code', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test("Redirect to /search_code after clicking Add item to inventory", function(assert) {
  assert.expect();
  visit("/");
  click($('div.center-text'));
  andThen(function() {
    assert.equal(currentPath(), "search_code");
  });
});



