import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import '../factories/orders_package';
import '../factories/designation';
import '../factories/item';
import FactoryGuy from 'ember-data-factory-guy';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';

var App, designation, item, orders_package1, orders_package2, orders_package3, orders_package4, orders_package5;

module('Order search list', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    designation = FactoryGuy.make("designation", { state: "closed" });
    item = FactoryGuy.make("item", { state: "submitted" });
    orders_package1 = FactoryGuy.make("orders_package", { state: "designated", item: item, designation: designation });
    orders_package2 = FactoryGuy.make("orders_package", { state: "designated", item: item, designation: designation });
    orders_package3 = FactoryGuy.make("orders_package", { state: "designated", item: item, designation: designation });
    orders_package4 = FactoryGuy.make("orders_package", { state: "dispatched", item: item, designation: designation });
    orders_package5 = FactoryGuy.make("orders_package", { state: "dispatched", item: item, designation: designation });
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test("display order with count of designated and dispatched orders_packages", function(assert) {
  assert.expect(1);
  visit("/orders/");
  fillIn('#searchText', designation.get("code"));
  andThen(function(){
    assert.equal($('ul.list li:first div.small-4.columns').text().trim(), "1");
  });
});
