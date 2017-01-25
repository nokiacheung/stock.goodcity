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

var App, designation, item, orders_package;

module('Item search list', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();

    var location = FactoryGuy.make("location");
    designation = FactoryGuy.make("designation", { state: "closed" });
    item = FactoryGuy.make("item", { state: "submitted", quantity: 10 });
    orders_package = FactoryGuy.make("orders_package", { state: "designated", quantity: 5, item: item, designation: designation });

    mockFindAll('designation').returns({json: {designations: [designation.toJSON({includeId: true})]}});
    mockFindAll('location').returns({json: {locations: [location.toJSON({includeId: true})]}});
    visit("/items");
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test("Partially designating a Package", function(assert) {

  mockFindAll('designation').returns({json: {designations: [designation.toJSON({includeId: true})]}});

  mockFindAll('item').returns({ json: {items: [item.toJSON({includeId: true})], orders_packages: [orders_package.toJSON({includeId: true})], meta: {search: item.get('inventoryNumber').toString()}}});

  // $.mockjax({url:"/api/v1/stockit_item*",responseText:{
  //    json: {items: [item.toJSON({includeId: true})]}
  // }});
  $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
        items: [item.toJSON({includeId: true})]
      }
  });


  fillIn("#searchText", item.get("inventoryNumber"));

  andThen(function() {
    assert.equal(currentPath(), "items.index");
  });

  andThen(function() {
    click($('.options-link-open'));
  });

  andThen(function() {
    click($('.receive-item-options div:eq(2) div'));
  });

  andThen(function() {
    assert.equal(currentPath(), "items.partial_designate");
    fillIn('#1', 5);
    click($('#partial_designate'));
  });
});

