// import Ember from 'ember';
// import { module, test } from 'qunit';
// import startApp from '../helpers/start-app';
// import '../factories/orders_package';
// import '../factories/designation';
// import '../factories/item';
// import '../factories/location';
// import '../factories/packages_location';
// import FactoryGuy from 'ember-data-factory-guy';
// import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';
// import { mockFindAll } from 'ember-data-factory-guy';

// var App, designation, item, orders_package, package_location, lctn, lctn2;

// module('Acceptance: Partial move', {
//   beforeEach: function() {
//     App = startApp({}, 2);
//     TestHelper.setup();
//     lctn = FactoryGuy.make("location");
//     lctn2 = FactoryGuy.make("location");
//     designation = FactoryGuy.make("designation");
//     item = FactoryGuy.make("item", { state: "submitted", quantity: 5 });
//     package_location = FactoryGuy.make("packages_location", { quantity: 5 , item: item, locationId: parseInt(lctn.id) });
//     orders_package = FactoryGuy.make("orders_package", { state: "designated", quantity: 5, item: item, designation: designation });

//     mockFindAll('designation').returns({json: {designations: [designation.toJSON({includeId: true})]}});
//     visit("/items/" + item.id + "/partial_move");
//     $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
//         items: [item.toJSON({includeId: true})]
//         }
//     });

//     $.mockjax({url: '/api/v1/item*', type: 'PUT', status: 200,responseText: {
//         items: [item.toJSON({includeId: true})]
//         }
//     });
//     mockFindAll('location').returns({json: {locations: [lctn.toJSON({includeId: true})]}});
//     mockFindAll('item').returns({ json: {items: [item.toJSON({includeId: true})], orders_packages: [orders_package.toJSON({includeId: true})], meta: {search: item.get('inventoryNumber').toString()}}});

//     $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
//           items: [item.toJSON({includeId: true})]
//         }
//     });

//     //visiting Item's partial move
//     visit("/items/" + item.id + "/partial_move");

//     //clicking on move link
//     andThen(function() {
//       click('.move-link');
//     });
//   },
//   afterEach: function() {
//     Ember.run(function() { TestHelper.teardown(); });
//     Ember.run(App, 'destroy');
//   }
// });

// test("Moving a package to same location is not allowed", function(assert) {
//   assert.expect(2);

//   //clicking on move button
//   andThen(function() {
//     click("#partial_move");
//   });

//   //clicking on first location
//   andThen(function() {
//     assert.equal(currentPath(), "items.search_location");
//     click('ul.list li div');
//   });

//   //checking warning message message of messagebox
//   andThen(function() {
//     assert.equal($('.popupOverlay:eq(2) p p').text().trim(), "You are trying to move quantity to same location. Full quantity is located at Bldg building1 Area area1");
//   });
// });

// test("Moving a package to different location", function(assert) {
//   assert.expect(1);

//   //Clicking on move button
//   andThen(function() {
//     click("#partial_move");
//   });

//   //Selecting first location
//   andThen(function() {
//     assert.equal(currentPath(), "items.search_location");
//     click('ul.list li div');
//   });

//   //Clicking on move of messageBox
//   andThen(function() {
//     click('.popupOverlay:eq(1) p p');
//   });
// });

// test("Clicking on move recalculates quantity", function(assert) {
//   assert.expect(1);

//   andThen(function() {
//     assert.equal($('#packages-qty-location-' + package_location.id).text().trim(), "5");
//   });
// });

// test("clicking on move link renders move and not now buttons", function(assert) {
//   assert.expect(2);

//   //Checking for move button
//   assert.equal($('#partial_move').text(), "Move");

//   //Checking for not now button
//   assert.equal($('#not-now').text(), "Not now");
// });

// test("clicking on back-link redirects to Item's detail page", function(assert) {
//   assert.expect(1);
//   click('.back-text');
//   andThen(function() {
//     assert.equal(currentPath(), "items.detail");
//   });
// });
