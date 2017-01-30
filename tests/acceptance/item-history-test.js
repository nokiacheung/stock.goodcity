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

var App, item, designation1, designation2, orders_package1, orders_package2;

module('Order search list', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    designation1 = FactoryGuy.make("designation", { state: "closed" });
    designation2 = FactoryGuy.make("designation", { state: "closed" });
    item = FactoryGuy.make("item", { state: "submitted" , designation: designation2, quantity: 0});
     $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
        items: [item.toJSON({includeId: true})]
        }
    });
    orders_package1 = FactoryGuy.make("orders_package", { state: "designated", quantity: 6, item: item, designation: designation1 });
    orders_package2 = FactoryGuy.make("orders_package", { state: "dispatched", quantity: 4, item: item, designation: designation2 });
    visit("/items/"+ item.id + "/history");
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test("Designated/Dispatched orders_packages count on item's history", function(assert) {
  assert.expect(2);
  assert.equal(currentPath(), "items.history");
  assert.equal(find('.history-block div.row').length, 3);
});

test("Designated/Dispatched orders_packages have ship/basket icons and respective status_bar color", function(assert) {
  assert.expect(2);
  //dispatched OrdersPackage
  assert.equal($('.history-block div.row:eq(1)').css( "background-color" ), "rgb(51, 79, 117)");
  //designated OrdersPackage
  assert.equal($('.history-block div.row:eq(2)').css( "background-color" ), "rgb(0, 28, 66)");
});



test("Redirects to Orders's detail on clicking any row", function(assert) {
  assert.expect(1);
  mockFindAll('designation').returns({json: {designations: [designation1.toJSON({includeId: true})]}});
  mockFindAll('orders_package').returns({json: {orders_packages: [orders_package1.toJSON({includeId: true})]}});
  click($('.history-block div.row:eq(1) div'));
  $.mockjax({url: "/api/v1/orders_packages*", type: 'GET', status: 200,responseText: {
        items: [orders_package1.toJSON({includeId: true})]
      }
  });
  andThen(function() {
    assert.equal(currentPath(), "orders.detail");
  });
});
