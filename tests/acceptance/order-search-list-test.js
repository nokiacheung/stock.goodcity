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

module('Acceptance: Order search list', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    designation = FactoryGuy.make("designation", { state: "closed" });
    item = FactoryGuy.make("item", { state: "submitted" });
    item1 = FactoryGuy.make("item", { state: "submitted" });
    orders_package = FactoryGuy.make("orders_package", { state: "designated", item: item, designation: designation });
    orders_package1 = FactoryGuy.make("orders_package", { state: "dispatched", item: item1, designation: designation });
    var data = {"user_profile":{"id":2,"first_name":"David","last_name":"Dara51","mobile":"51111111"}};

    $.mockjax({url:"/api/v1/auth/current_user_profil*",
      responseText: data });
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test("Order has designated OrdersPackage", function(assert) {
  assert.expect(1);

  visit("/orders/");

  mockFindAll('designation').returns({ json: {designations: [designation.toJSON({includeId: true})], items: [item.toJSON({includeId: true})], orders_packages: [orders_package.toJSON({includeId: true})], meta: {search: designation.get('code').toString()}}});
  mockFindAll('orders_package').returns({ json: {orders_packages: [orders_package.toJSON({includeId: true})]}});

  fillIn('#searchText', designation.get("code"));

  andThen(function(){
    assert.equal(parseInt(find('ul.list li:first div.small-4.columns').text().trim().replace(/ +/g, ""), 10), 1);
  });
});

test("Order has dispatched OrdersPackage", function(assert) {
  assert.expect(1);

  visit("/orders/");

  mockFindAll('designation').returns({ json: {designations: [designation.toJSON({includeId: true})], items: [item1.toJSON({includeId: true})], orders_packages: [orders_package1.toJSON({includeId: true})], meta: {search: designation.get('code').toString()}}});
  mockFindAll('orders_package').returns({ json: {orders_packages: [orders_package1.toJSON({includeId: true})]}});

  fillIn('#searchText', designation.get("code"));

  andThen(function(){
    assert.equal(parseInt(find('ul.list li:first div.small-4.columns').text().trim().replace(/ +/g, "").slice(-1), 10), 1);
  });
});
