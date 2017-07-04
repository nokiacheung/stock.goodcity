// import Ember from 'ember';
// import { module, test } from 'qunit';
// import startApp from '../helpers/start-app';
// import '../factories/orders_package';
// import '../factories/designation';
// import '../factories/item';
// import '../factories/location';
// import FactoryGuy from 'ember-data-factory-guy';
// import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';
// import { mockFindAll } from 'ember-data-factory-guy';

// var App, designation, designation1, item, pkg1, pkg2, pkg3, pkg4, pkg5, orders_package, orders_package1, orders_package2, orders_package3, orders_package4, orders_package5, orders_package6;

// module('Acceptance: Item search list', {
//   beforeEach: function() {
//     App = startApp({}, 2);
//     TestHelper.setup();
//     var location = FactoryGuy.make("location");
//     designation = FactoryGuy.make("designation", { state: "closed" });
//     designation1 = FactoryGuy.make("designation", { state: "closed" });
//     item = FactoryGuy.make("item", { state: "submitted", quantity: 10 });
//     pkg1 = FactoryGuy.make("item", { state: "submitted", quantity: 0 });
//     pkg2 = FactoryGuy.make("item", { state: "submitted", quantity: 5 });
//     pkg3 = FactoryGuy.make("item", { state: "submitted", quantity: 0 });
//     pkg4 = FactoryGuy.make("item", { state: "submitted", quantity: 0 , designation: designation});
//     pkg5 = FactoryGuy.make("item", { state: "submitted", quantity: 0 });
//     orders_package = FactoryGuy.make("orders_package", { state: "designated", quantity: 5, item: pkg2, designation: designation });
//     orders_package1 = FactoryGuy.make("orders_package", { state: "designated", quantity: 10, item: pkg1, designation: designation });
//     orders_package2 = FactoryGuy.make("orders_package", { state: "designated", quantity: 5, item: pkg3, designation: designation });
//     orders_package3 = FactoryGuy.make("orders_package", { state: "designated", quantity: 5, item: pkg3, designation: designation1 });
//     orders_package4 = FactoryGuy.make("orders_package", { state: "dispatched", quantity: 10, item: pkg4, designation: designation });
//     orders_package5 = FactoryGuy.make("orders_package", { state: "dispatched", quantity: 5, item: pkg5, designation: designation });
//     orders_package6 = FactoryGuy.make("orders_package", { state: "dispatched", quantity: 5, item: pkg5, designation: designation1 });
//     mockFindAll('designation').returns({json: {designations: [designation.toJSON({includeId: true})]}});
//     mockFindAll('location').returns({json: {locations: [location.toJSON({includeId: true})]}});
//     visit("/items");
//   },
//   afterEach: function() {
//     Ember.run(function() { TestHelper.teardown(); });
//     Ember.run(App, 'destroy');
//   }
// });


// test("Item status bar shows In-stock for non-designated item", function(assert) {
//   assert.expect(3);

//   mockFindAll('item').returns({ json: {items: [item.toJSON({includeId: true})], orders_packages: [orders_package1.toJSON({includeId: true})], meta: {search: item.get('inventoryNumber').toString()}}});

//   fillIn("#searchText", item.get("inventoryNumber"));

//   andThen(function() {
//     assert.equal(currentPath(), "items.index");
//     assert.equal($('.item_block div.dispatch_details div.stock_status:first').text().trim(), "In Stock");
//     //Test for available/designated/dispatched item count
//     assert.equal($('.available-designate-dispatch-count:first').text().trim(), "10/0/0");
//   });
// });

// test("Item status bar shows designation code if full qty is designated to one order", function(assert) {
//   assert.expect(3);

//   mockFindAll('item').returns({ json: {items: [pkg1.toJSON({includeId: true})], orders_packages: [orders_package1.toJSON({includeId: true})], designations:[designation.toJSON({includeId: true})], meta: {search: pkg1.get('inventoryNumber').toString()}}});

//   fillIn("#searchText", pkg1.get("inventoryNumber"));

//   andThen(function() {
//     assert.equal(currentPath(), "items.index");
//     assert.equal($('.item_block div.dispatch_details div:first').text().trim(), "designated");
//     //Test for available/designated/dispatched item count
//     assert.equal($('.available-designate-dispatch-count:first').text().trim(), "0/10/0");
//   });
// });

// test("Item status bar shows In-stock if item(qty > 0) is partially designated", function(assert) {
//   assert.expect(3);

//   mockFindAll('item').returns({ json: {items: [pkg2.toJSON({includeId: true})], orders_packages: [orders_package.toJSON({includeId: true})], designations:[designation.toJSON({includeId: true})], meta: {search: pkg2.get('inventoryNumber').toString()}}});

//   fillIn("#searchText", pkg2.get("inventoryNumber"));

//   andThen(function() {
//     assert.equal(currentPath(), "items.index");
//     assert.equal($('.item_block div.dispatch_details div.stock_status').text().trim(), "In Stock");
//     //Test for available/designated/dispatched item count
//     assert.equal($('.available-designate-dispatch-count:first').text().trim(), "5/10/0");
//   });
// });

// test("Item status bar shows 'designated' if item(qty = 0) is partially designated to different order", function(assert) {
//   assert.expect(3);

//   mockFindAll('item').returns({ json: {items: [pkg3.toJSON({includeId: true})], orders_packages: [orders_package2.toJSON({includeId: true}), orders_package3.toJSON({includeId: true})], designations:[designation.toJSON({includeId: true}), designation1.toJSON({includeId: true})], meta: {search: pkg3.get('inventoryNumber').toString()}}});

//   fillIn("#searchText", pkg3.get("inventoryNumber"));

//   andThen(function() {
//     assert.equal(currentPath(), "items.index");
//     assert.equal($('.item_block div.dispatch_details div span').text().trim().substr(0,10), "designated");
//     //Test for available/designated/dispatched item count
//     assert.equal($('.available-designate-dispatch-count:first').text().trim(), "0/10/0");
//   });
// });

// test("Item status bar shows Order code if item(qty = 0) is partially dispatched to one order", function(assert) {
//   assert.expect(3);

//   mockFindAll('item').returns({ json: {items: [pkg4.toJSON({includeId: true})], orders_packages: [orders_package4.toJSON({includeId: true})], designations:[designation.toJSON({includeId: true})], meta: {search: pkg4.get('inventoryNumber').toString()}}});

//   fillIn("#searchText", pkg4.get("inventoryNumber"));

//   andThen(function() {
//     assert.equal(currentPath(), "items.index");
//     assert.equal($('.item_block div.dispatch_details div span').text().trim().substr(0,6), "L24401");
//     //Test for available/designated/dispatched item count
//     assert.equal($('.available-designate-dispatch-count:first').text().trim(), "0/0/10");
//   });
// });

// test("Item status bar shows 'Out of Stock' if item(qty = 0) is fully dispatched to one order", function(assert) {
//   assert.expect(3);

//   mockFindAll('item').returns({ json: {items: [pkg5.toJSON({includeId: true})], orders_packages: [orders_package5.toJSON({includeId: true}) , orders_package6.toJSON({includeId: true})], designations:[designation.toJSON({includeId: true}), designation1.toJSON({includeId: true})], meta: {search: pkg5.get('inventoryNumber').toString()}}});

//   fillIn("#searchText", pkg5.get("inventoryNumber"));

//   andThen(function() {
//     assert.equal(currentPath(), "items.index");
//     assert.equal($('.item_block div.dispatch_details div.small-3.columns:first').text().trim(), "Out of stock");
//     //Test for available/designated/dispatched item count
//     assert.equal($('.available-designate-dispatch-count:first').text().trim(), "0/0/10");
//   });
// });
