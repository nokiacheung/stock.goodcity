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

var App, pkg, pkg1, pkg2, order1, order2, orders_pkg1, orders_pkg2;

module('Acceptance: Item Available actions', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    var location = FactoryGuy.make("location");
    order1 = FactoryGuy.make("designation", { id: 100, state: "submitted" });
    order2 = FactoryGuy.make("designation", { id: 101, state: "submitted" });
    pkg = FactoryGuy.make("item", { id: 50, state: "submitted" , quantity: 10});
    pkg1 = FactoryGuy.make("item", { id: 51, state: "submitted" , designation: order2, quantity: 4});
    pkg2 = FactoryGuy.make("item", { id: 52, state: "submitted" , designation: order2, quantity: 0});
    orders_pkg1 = FactoryGuy.make("orders_package", { id: 500, state: "designated", quantity: 6, item: pkg1, designation: order1 });
    orders_pkg2 = FactoryGuy.make("orders_package", { id: 501, state: "dispatched", quantity: 10, item: pkg2, designation: order2 });
    mockFindAll('designation').returns({json: {designations: [order1.toJSON({includeId: true})]}});
    mockFindAll('location').returns({json: {locations: [location.toJSON({includeId: true})]}});
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test("Available actions for non-designated item", function(assert) {
  assert.expect(2);
  visit("/items");
  fillIn("#searchText", pkg.get("inventoryNumber"));
  mockFindAll('item').returns({ json: {items: [pkg.toJSON({includeId: true})], orders_packages: [orders_pkg1.toJSON({includeId: true})], designations:[order2.toJSON({includeId: true})], meta: {search: pkg.get('inventoryNumber').toString()}}});
  andThen(function() {
    assert.equal(currentPath(), "items.index");
    click($('div.options-link-open'));
    //dispatch disabled(all other options are enabled)
    assert.equal($('div.receive-item-options div:eq(4)')[0].className, 'disabled');
  });
});

test("Available actions for partially-designated item(qty > 0)", function(assert) {
  assert.expect(2);
   visit("/items");
  fillIn("#searchText", pkg1.get("inventoryNumber"));
  mockFindAll('item').returns({ json: {items: [pkg1.toJSON({includeId: true})], orders_packages: [orders_pkg1.toJSON({includeId: true})], designations:[order2.toJSON({includeId: true})], meta: {search: pkg1.get('inventoryNumber').toString()}}});
  andThen(function() {
    assert.equal(currentPath(), "items.index");
    click($('div.options-link-open'));
    //All actions are enabled including dispatch
    assert.equal($('div.receive-item-options div.disabled')[0], undefined);
  });
});

test("Available actions for fully-designated item(qty = 0)", function(assert) {
  assert.expect(3);
   visit("/items");
  fillIn("#searchText", pkg2.get("inventoryNumber"));
  mockFindAll('item').returns({ json: {items: [pkg2.toJSON({includeId: true})], orders_packages: [orders_pkg2.toJSON({includeId: true})], designations:[order2.toJSON({includeId: true})], meta: {search: pkg2.get('inventoryNumber').toString()}}});
  andThen(function() {
    assert.equal(currentPath(), "items.index");
    click($('div.options-link-open'));
    //Move is disabled as qty = 0
    assert.equal($('div.receive-item-options div.disabled:first').text().trim(), "Move");
    //designate is disabled
    assert.equal($('div.receive-item-options div.disabled:last').text().trim(), "designate");
  });
});

