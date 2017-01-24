import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import '../factories/orders_package';
import '../factories/designation';
import '../factories/item';
import FactoryGuy from 'ember-data-factory-guy';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';

var App, designation, item, orders_package;

module('Order search list', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    designation = FactoryGuy.make("designation", { state: "closed" });
    item = FactoryGuy.make("item", { state: "submitted" });
    orders_package = FactoryGuy.make("orders_package", { state: "designated", item: item, designation: designation });
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test("display order with count of designated and dispatched orders_packages", function(assert) {
  var data = {"designations":[{"status":"Active","code": "L24401","id":1,"item_ids":[1]}], "items":[{"id":1,"inventory_number":"C4234","orders_package_ids":[1255,1256,1271]}],"code":[{"id":143,"name":"Assorted/Mixed Box of Eyeglasses","code":"MEW","other_child_packages":null,"default_child_packages":"MEW","other_terms":null,"visible_in_selects":true,"location_id":null}],"locations":[{"id":7,"building":"24","area":"D","stockit_id":7}],"donor_conditions":[{"id":3,"name":"Heavily Used"}],"orders_packages":[{"id":101,"package_id":1,"order_id":1,"state":"designated","quantity":1,"designation_id":1,"item_id":1}
      ]};
  assert.expect(1);
  $.mockjax({url:"/api/v1/designation*", status:200, responseText: data});
  visit("/orders/");
  fillIn('#searchText', designation.get("code"));
  andThen(function(){
    assert.equal($('ul.list li:first div.small-4.columns').text().trim(), 1);
  });
});
