import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import '../factories/orders_package';
import '../factories/designation';
import '../factories/item';
import '../factories/location';
import '../factories/packages_location';
import FactoryGuy from 'ember-data-factory-guy';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';
import { mockFindAll } from 'ember-data-factory-guy';

var App, designation, item, orders_package, package_location;

module('Acceptance: Partial designate', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();

    designation = FactoryGuy.make("designation", { state: "closed" });
    item = FactoryGuy.make("item", { state: "submitted", quantity: 5 });
    package_location = FactoryGuy.make("packages_location", { quantity: 5 , item: item});
    orders_package = FactoryGuy.make("orders_package", { state: "designated", quantity: 5, item: item, designation: designation });

    mockFindAll('designation').returns({json: {designations: [designation.toJSON({includeId: true})]}});
    visit("/items/" + item.id + "/partial_move");
    $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
        items: [item.toJSON({includeId: true})]
        }
    });
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test("Partially moving a Package", function(assert) {
  assert.expect(2);
  var location = FactoryGuy.make("location");
  $.mockjax({url: '/api/v1/item*', type: 'PUT', status: 200,responseText: {
        items: [item.toJSON({includeId: true})]
        }
    });
  mockFindAll('location').returns({json: {locations: [location.toJSON({includeId: true})]}});
  mockFindAll('item').returns({ json: {items: [item.toJSON({includeId: true})], orders_packages: [orders_package.toJSON({includeId: true})], meta: {search: item.get('inventoryNumber').toString()}}});

  $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
        items: [item.toJSON({includeId: true})]
      }
  });
  //clicking on move button
  click($('#partial_move'));
  andThen(function() {
    assert.equal(currentPath(), "items.search_location");
    //selcting first location to move
    click($('ul.list-activity li:first'));
  });
  andThen(function() {
    //clicking move on messagebox
    click($('div#messageBox:eq(2) a:last'));
  });
  andThen(function() {
    //back to partial move screen
    assert.equal(currentPath(), "items.partial_move");
  });
});

