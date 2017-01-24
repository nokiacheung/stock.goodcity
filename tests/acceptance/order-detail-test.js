import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import '../factories/orders_package';
import '../factories/designation';
import '../factories/item';
import FactoryGuy from 'ember-data-factory-guy';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';
import { mockFindAll } from 'ember-data-factory-guy';

var App, designation, item, item1, orders_package, orders_package1;

module('Order search list', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    designation = FactoryGuy.make("designation", { state: "closed" });
    item = FactoryGuy.make("item", { state: "submitted" });
    item1 = FactoryGuy.make("item", { state: "submitted" });
    orders_package = FactoryGuy.make("orders_package", { state: "designated", item: item, designation: designation });
    orders_package1 = FactoryGuy.make("orders_package", { state: "dispatched", item: item1, designation: designation });

    visit("/orders/");

    fillIn('#searchText', designation.get("code"));

    mockFindAll('designation').returns({ json: {designations: [designation.toJSON({includeId: true})], items: [item.toJSON({includeId: true}), item1.toJSON({includeId: true})], orders_packages: [orders_package.toJSON({includeId: true}), orders_package1.toJSON({includeId: true})], meta: {search: designation.get('code').toString()}}});
    mockFindAll('orders_package').returns({ json: {orders_packages: [orders_package.toJSON({includeId: true}), orders_package1.toJSON({includeId: true})]}});
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test("Designated/dispatched item count on Order detail", function(assert) {
  assert.expect(2);

  andThen(function(){
    click($('ul.list li:first div.row.state_details'));
    andThen(function() {
      assert.equal(currentPath(), "orders.detail");
      assert.equal($('.item_count').text().trim().replace(/(\r\n|\n|\r)/gm,""), "Items      (1 Designated, 1 Dispatched)");
    });
  });
});

test("Dispatched/Designated OrdersPackage's status_bar has different colors", function(assert) {
  assert.expect(3);

  andThen(function(){
    click($('ul.list li:first div.row.state_details'));
    andThen(function() {
      assert.equal(currentPath(), "orders.detail");
      assert.equal($('.item_block div.dispatch_details.designated').css('background-color'), "rgb(51, 79, 117)");
      assert.equal($('.item_block div.dispatch_details.dispatched').css('background-color'), "rgb(0, 28, 66)");
    });
  });
});
