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
    item = FactoryGuy.make("item", { state: "submitted" , designation: designation});
    item1 = FactoryGuy.make("item", { state: "submitted", quantity: 10 , designation: designation});
    orders_package = FactoryGuy.make("orders_package", { state: "designated", quantity: 6, item: item, designation: designation });
    orders_package1 = FactoryGuy.make("orders_package", { state: "dispatched", quantity: 4, item: item1, designation: designation });

    visit("/orders/");

    fillIn('#searchText', designation.get("code"));
    andThen(function(){
      click($('ul.list li:first div.row.state_details'));
    });

    mockFindAll('designation').returns({ json: {designations: [designation.toJSON({includeId: true})], items: [item.toJSON({includeId: true}), item1.toJSON({includeId: true})], orders_packages: [orders_package.toJSON({includeId: true}), orders_package1.toJSON({includeId: true})], meta: {search: designation.get('code').toString()}}});
    mockFindAll('orders_package').returns({ json: {orders_packages: [orders_package.toJSON({includeId: true}), orders_package1.toJSON({includeId: true})]}});
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test("Designated/Dispatched item count on Order detail", function(assert) {
  assert.expect(2);

  andThen(function() {
    assert.equal(currentPath(), "orders.detail");
    assert.equal($('.item_count').text().trim().replace(/(\r\n|\n|\r)/gm,""), "Items      (1 Designated, 1 Dispatched)");
  });
});

test("Dispatched/Designated OrdersPackage's status_bar has different colors", function(assert) {
  assert.expect(3);

  andThen(function() {
    assert.equal(currentPath(), "orders.detail");
    //status bar color for designated OrdersPackage
    assert.equal($('.item_block div.dispatch_details.designated').css('background-color'), "rgb(51, 79, 117)");
    //status bar color for dispatched OrdersPackage
    assert.equal($('.item_block div.dispatch_details.dispatched').css('background-color'), "rgb(0, 28, 66)");
  });
});

test("Available actions for designated OrdersPackage", function(assert) {
  assert.expect(3);

  click($('.options-link-open:first'));

  andThen(function() {
    //available actions are dispatch and un-designate
    assert.equal(currentPath(), "orders.detail");
    assert.equal($('div.receive-options:eq(0) div .fa-ship').parent().text().trim(), "dispatch");
    assert.equal($('div.receive-options:eq(0) div .fa-times-circle-o').parent().text().trim(), "un-designate");
  });
});

test("Available actions for dispatched OrdersPackage", function(assert) {
  assert.expect(3);

  click($('.options-link-open:first'));

  andThen(function() {
    //available action is undispatch
    assert.equal(currentPath(), "orders.detail");
    assert.equal($('div.receive-options:eq(1) div .fa-exclamation-triangle:first').parent().text().trim(), "undispatch");
    //un-designate action disabled
    assert.equal($('div.receive-options:eq(1) div .fa-times-circle-o').parent().attr('class'), "disabled");
  });
});

test("Item description shows quantity of OrdersPackage not Item", function(assert) {
  assert.expect(3);

  click($('.options-link-open:first'));

  andThen(function() {
    assert.equal(currentPath(), "orders.detail");
    //qty of designated Orderspackage
    assert.equal($('.one-line-ellipsis:first').text().substr(0,2).trim(), "6");
    //qty of dispatched Orderspackage
    assert.equal($('.one-line-ellipsis:last').text().substr(0,2).trim(), "4");
  });
});
