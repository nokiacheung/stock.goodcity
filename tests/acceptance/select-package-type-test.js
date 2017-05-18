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

var App, pkg, lctn, designation, code;

module('Acceptance: Select PackageType code', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    visit("/");
    lctn = FactoryGuy.make("location");
    designation = FactoryGuy.make("designation", { state: "closed" });
    mockFindAll('designation').returns({json: {designations: [designation.toJSON({includeId: true})]}});
    mockFindAll('location').returns({json: {locations: [lctn.toJSON({includeId: true})]}});
    code = FactoryGuy.make("code", {location: lctn});
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test("Redirect to /search_code after clicking Add item to inventory", function(assert) {
  assert.expect(2);

  $.mockjax({url: '/api/v1/package_type*', type: 'GET', status: 200,responseText: {
      codes: [code.toJSON({includeId: true})]
    }
  });
  click($('.center-text a'));
  andThen(function() {
    assert.equal(currentPath(), "search_code");
    fillIn("#searchText", "Baby Crib");
    click($('.list li:first')[0]);
    $.mockjax({url:"/api/v1/inventory*", type: 'POST', status: 200,responseText:{"inventory_number":"000311"}});
    $.mockjax({url:"/api/v1/images/generate_sign*", type: 'GET', status: 200,responseText:{"api_key":123456789876543,"signature":"3ec17bf700bc23446d61932385d","timestamp":1234567891,"tags":"staging"}});
    andThen(function() {


      assert.equal(currentPath(), "items.new");
      //fillIn("#searchText", "Baby Crib");
  });
  });
});



