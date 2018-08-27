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

// var App, designation, item, item1, orders_package, orders_package1;

// module('Acceptance: Partial designate', {
//   beforeEach: function() {
//     App = startApp({}, 2);
//     TestHelper.setup();

//     var location = FactoryGuy.make("location");
//     designation = FactoryGuy.make("designation");
//     item = FactoryGuy.make("item", { state: "submitted", quantity: 5 });
//     item1 = FactoryGuy.make("item", { state: "submitted", quantity: 10 });
//     orders_package = FactoryGuy.make("orders_package", { state: "designated", quantity: 5, item: item, designation: designation });
//     orders_package1 = FactoryGuy.make("orders_package", { state: "designated", quantity: 0, item: item1, designation: designation });

//     mockFindAll('designation').returns({json: {designations: [designation.toJSON({includeId: true})]}});
//     mockFindAll('location').returns({json: {locations: [location.toJSON({includeId: true})]}});
//     visit("/items");
//   },
//   afterEach: function() {
//     Ember.run(function() { TestHelper.teardown(); });
//     Ember.run(App, 'destroy');
//   }
// });

// test("Partially designating a Package", function(assert) {
//   assert.expect(1);
//   var done = assert.async(1);
//   mockFindAll('designation').returns({json: {designations: [designation.toJSON({includeId: true})]}});

//   mockFindAll('item').returns({ json: {items: [item1.toJSON({includeId: true})], orders_packages: [orders_package1.toJSON({includeId: true})], meta: {search: item1.get('inventoryNumber').toString()}}});

//   $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
//         items: [item1.toJSON({includeId: true})]
//       }
//   });

//   $.mockjax({url: '/api/v1/package*', type: 'PUT', status: 200,responseText: {
//       items: [item1.toJSON({includeId: true})]
//     }
//   });

//   //mock for partial_designate url
//   $.mockjax({url: '/api/v1/item*', type: 'PUT', status: 200,responseText: {
//       items: [item.toJSON({includeId: true})],
//       orders_packages: [orders_package.toJSON({includeId: true})]
//     }
//   });

//   fillIn("#searchText", item.get("inventoryNumber"));

//   andThen(function() {
//     //actions list
//     click(find('.options-link-open'));
//     //designate
//     click(find('.receive-item-options div:eq(2) div'));
//   });

//   andThen(function() {
//     assert.equal(currentPath(), "items.partial_designate");
//     done();
//     //putting value to textfield and clicking ok
//     fillIn(find('.partial_designate_textfield input'), 5);
//     click(find('button#partial_designate'));
//   });

//   andThen(function() {
//     //clicking on first recently used order
//     click(find('ul.list li:first'));
//     //click ok on messagebox
//     click(find('div#messageBox:eq(2) a:last'));
//   });
// });

