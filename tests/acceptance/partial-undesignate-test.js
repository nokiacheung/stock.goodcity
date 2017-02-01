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

// var App, pkg1, order1, orders_pkg1;

// module('Acceptance: Item Available actions', {
//   beforeEach: function() {
//     App = startApp({}, 2);
//     TestHelper.setup();
//     var location = FactoryGuy.make("location");
//     order1 = FactoryGuy.make("designation", { id: 100, state: "submitted" });
//     pkg1 = FactoryGuy.make("item", { id: 51, state: "submitted" , designation: order1, quantity: 0});
//     orders_pkg1 = FactoryGuy.make("orders_package", { id: 500, state: "designated", quantity: 10, item: pkg1, designation: order1 });

//     mockFindAll('item').returns({ json: {items: [pkg1.toJSON({includeId: true})], orders_packages: [orders_pkg1.toJSON({includeId: true})], designations:[order1.toJSON({includeId: true})], meta: {search: pkg1.get('inventoryNumber').toString()}}});
//     mockFindAll('location').returns({json: {locations: [location.toJSON({includeId: true})]}});
//     mockFindAll('designation').returns({json: {designations: [order1.toJSON({includeId: true})], orders_packages: [orders_pkg1.toJSON({includeId: true})], items: [pkg1.toJSON({includeId: true})]}});
//     visit("/items");
//   },
//   afterEach: function() {
//     Ember.run(function() { TestHelper.teardown(); });
//     Ember.run(App, 'destroy');
//   }
// });

// test("Fully un-designating a Package", function(assert) {
//   assert.expect(2);
//   $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
//         items: [pkg1.toJSON({includeId: true})],
//         orders_packages: [orders_pkg1.toJSON({includeId: true})]
//       }
//   });

//   mockFindAll('item').returns({ json: {items: [pkg1.toJSON({includeId: true})], orders_packages: [orders_pkg1.toJSON({includeId: true})], designations:[order1.toJSON({includeId: true})], meta: {search: pkg1.get('inventoryNumber').toString()}}});

//   assert.equal(currentPath(), "items.index");
//   fillIn("#searchText", pkg1.get("inventoryNumber"));
//   andThen(function() {
//     //clicking on order code
//     click($('.item_block:first div:first div:first'));
//   });
//   andThen(function() {
//     assert.equal(currentPath(), "items.partial_undesignate");
//     //clicking on undesignate button
//     click($('.undesignateButton'));
//   });
//   andThen(function() {
//     //clicking ok of message box
//     click($('#messageBox a:last'));
//   });
// });

// test("Partially un-designating a Package", function(assert) {
//   assert.expect(2);
//   $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
//         items: [pkg1.toJSON({includeId: true})],
//         orders_packages: [orders_pkg1.toJSON({includeId: true})]
//       }
//   });

//   mockFindAll('item').returns({ json: {items: [pkg1.toJSON({includeId: true})], orders_packages: [orders_pkg1.toJSON({includeId: true})], designations:[order1.toJSON({includeId: true})], meta: {search: pkg1.get('inventoryNumber').toString()}}});

//   assert.equal(currentPath(), "items.index");
//   fillIn("#searchText", pkg1.get("inventoryNumber"));
//   andThen(function() {
//     //clicking on order code
//     click($('.item_block:first div:first div:first'));
//   });
//   andThen(function() {
//     assert.equal(currentPath(), "items.partial_undesignate");
//     //clicking on undesignate button
//     fillIn($("input#500"), 5);
//     click($('.undesignateButton'));
//   });
//   andThen(function() {
//     //clicking ok of message box
//     click($('#messageBox a:last'));
//   });
// });
