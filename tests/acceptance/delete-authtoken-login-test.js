import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import '../factories/item';
import '../factories/location';
import '../factories/designation';
import '../factories/code';
import FactoryGuy from 'ember-data-factory-guy';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';
import { mockFindAll } from 'ember-data-factory-guy';

var App;

module("Deleting AuthToken from LocalStorage shows 'You must login!' pop-up and redirects to login'", {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    var location1 = FactoryGuy.make("location");
    var designation = FactoryGuy.make("designation", { state: "closed" });
    mockFindAll('designation').returns({json: {designations: [designation.toJSON({includeId: true})]}});
    mockFindAll('location').returns({json: {locations: [location1.toJSON({includeId: true})]}});
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

// test("Check 'This item is not inventorized yet or has been mark as missing.' message for un-invetorised items", function(assert) {
//   var loc = FactoryGuy.make("location", { id: 7 });
//   var pkgLocation = FactoryGuy.make("packages_location", {id: 764, location: loc});
//   var pkg = FactoryGuy.make("item", { id: 971, quantity: 1,  notes: "Baby Crib, Set (frame, mattress)", inventoryNumber: null, "package_type_id":9, packageLocations: [ pkgLocation ]  });

//   $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
//     items: [pkg.toJSON({includeId: true})]
//     }
//   });

//   visit("items/"+pkg.id);

//   andThen(function() {
//     assert.equal($('#messageBox #messageBoxText').text().trim(), "This item is not inventoried yet or has been marked as missing.");
//     // trigger($('#bt1.right.button'));
//   });

//   // andThen(function() {
//   //   trigger($('#bt1.right.button'));
//   // });
// });

test("Deleting AuthToken from LocalStorage shows 'You must login!' pop-up and redirects to login", function(assert) {
  var pkg = FactoryGuy.make("item", { id: 971, quantity: 1,  notes: "Baby Crib, Set (frame, mattress)", "package_type_id":9 });

  $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
    items: [pkg.toJSON({includeId: true})]
    }
  });

  visit("items/"+pkg.id);

  window.localStorage.authToken = null;
  andThen(function() {
    assert.equal($('#messageBox #messageBoxText').text().trim(), "You must login!");
  });
});
