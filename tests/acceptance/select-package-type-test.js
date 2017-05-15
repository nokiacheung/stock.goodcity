import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import '../factories/item';
import '../factories/location';
import '../factories/designation';
import '../factories/code';
import FactoryGuy from 'ember-data-factory-guy';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';
import { mockFindAll } from 'ember-data-factory-guy';

var App, pkg, location, designation, code;

module('Acceptance: Select PackageType code', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    visit("/");
    location = FactoryGuy.make("location");
    designation = FactoryGuy.make("designation", { state: "closed" });
    mockFindAll('designation').returns({json: {designations: [designation.toJSON({includeId: true})]}});
    mockFindAll('location').returns({json: {locations: [location.toJSON({includeId: true})]}});
    code = FactoryGuy.make("code");
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test("Redirect to /search_code after clicking Add item to inventory", function(assert) {
  assert.expect(1);

  $.mockjax({url: '/api/v1/package_type*', type: 'GET', status: 200,responseText: {
      codes: [code.toJSON({includeId: true})],
      meta: {search: code.get('name').toString()}
    }
  });
  click($('.center-text a'));
  andThen(function() {

    assert.equal(currentPath(), "search_code");
    fillIn("#searchText", code.get('name'));
  });
});



