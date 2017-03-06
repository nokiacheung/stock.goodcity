import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import '../factories/orders_package';
import '../factories/designation';
import '../factories/item';
import '../factories/location';
import FactoryGuy from 'ember-data-factory-guy';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';
import { mockFindAll } from 'ember-data-factory-guy';

var App, designation, item1, orders_package1;

module('Acceptance: Undispatch select location', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    designation = FactoryGuy.make("designation", { state: "closed" });
    item1 = FactoryGuy.make("item", { state: "submitted", quantity: 10 , designation: designation});
    orders_package1 = FactoryGuy.make("orders_package", { state: "dispatched", quantity: 4, item: item1, designation: designation });

    visit("/orders/");

    fillIn('#searchText', designation.get("code"));
    andThen(function(){
      click(find('ul.list li:first div.row.state_details'));
    });

    mockFindAll('designation').returns({ json: {designations: [designation.toJSON({includeId: true})], items: [item1.toJSON({includeId: true})], orders_packages: [orders_package1.toJSON({includeId: true})], meta: {search: designation.get('code').toString()}}});
    mockFindAll('orders_package').returns({ json: {orders_packages: [orders_package1.toJSON({includeId: true})]}});
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test("Moving item to selected location on undispatch", function(assert) {
  assert.expect(3);
  var location = FactoryGuy.make("location");
  mockFindAll('location').returns({json: {locations: [location.toJSON({includeId: true})]}});
  $.mockjax({url: '/api/v1/item*', type: 'PUT', status: 200,responseText: {
      items: [item1.toJSON({includeId: true})]
    }
  });
  andThen(function() {
    assert.equal(currentPath(), "orders.detail");
    andThen(function() {
      //clicking on undispatch
      click($('div.options-link-open:first'));
      click($('.fa-exclamation-triangle:first'));
    });
  });

  andThen(function() {
    assert.equal(currentPath(), "items.search_location");
    //selecting first location
    click($('ul.list-activity li:first'));
    andThen(function() {
      //clicking on move of messageBox
      click($('div#messageBox:eq(3) a:last'));
    });
  });
  andThen(function() {
    assert.equal(currentPath(), "items.detail");
  });
});
