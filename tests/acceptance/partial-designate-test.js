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

var App, designation, item, item1, orders_package, orders_package1;

module('Item search list', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();

    var location = FactoryGuy.make("location");
    designation = FactoryGuy.make("designation", { state: "closed" });
    item = FactoryGuy.make("item", { state: "submitted", quantity: 5 });
    item1 = FactoryGuy.make("item", { state: "submitted", quantity: 10 });
    orders_package = FactoryGuy.make("orders_package", { state: "designated", quantity: 5, item: item, designation: designation });
    orders_package1 = FactoryGuy.make("orders_package", { state: "designated", quantity: 0, item: item1, designation: designation });

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
  assert.expect(4);

  mockFindAll('designation').returns({json: {designations: [designation.toJSON({includeId: true})]}});

  mockFindAll('item').returns({ json: {items: [item1.toJSON({includeId: true})], orders_packages: [orders_package1.toJSON({includeId: true})], meta: {search: item1.get('inventoryNumber').toString()}}});

  $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
        items: [item1.toJSON({includeId: true})]
      }
  });

  $.mockjax({url: '/api/v1/package*', type: 'PUT', status: 200,responseText: {
        items: [item1.toJSON({includeId: true})]
      }
  });

  //mock for partial_designate url
  $.mockjax({url: '/api/v1/item*', type: 'PUT', status: 200,responseText: {
        items: [item.toJSON({includeId: true})],
        orders_packages: [orders_package.toJSON({includeId: true})]
      }
  });

  fillIn("#searchText", item.get("inventoryNumber"));

  andThen(function() {
    assert.equal(currentPath(), "items.index");
  });

  andThen(function() {
    //actions list
    click($('.options-link-open'));
  });

  andThen(function() {
    //designate
    click($('.receive-item-options div:eq(2) div'));
  });

  andThen(function() {
    //partial designate page
    assert.equal(currentPath(), "items.partial_designate");
    andThen(function() {
      //putting value to textfield and clicking ok
      fillIn($('.partial_designate_textfield input'), 5);
      click($('button#partial_designate'));
    });
  });

  andThen(function() {
    //search order to designate
    assert.equal(currentPath(), "items.search_order");
    //clicking on first recently used order
    click($('ul.list li:first'));
    andThen(function() {
      //click ok on messagebox
      click($('div#messageBox:eq(2) a:last'));
    });
  });

  andThen(function() {
    //redirect to item's index after partial designate
    assert.equal(currentPath(), "items.index");
  });
});

