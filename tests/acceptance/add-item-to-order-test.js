import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import FactoryGuy from 'ember-data-factory-guy';
import '../factories/designation';
import { mockFindAll } from 'ember-data-factory-guy';

var App, designation, item, item1, orders_package, orders_package1;

module('Acceptance: Add item to order', {
  beforeEach: function(){
    App = startApp({}, 2);
    designation = FactoryGuy.make("designation");
    var data = {"user_profile":{"id":2,"first_name":"David","last_name":"Dara51","mobile":"51111111"}};

    $.mockjax({url:"/api/v1/auth/current_user_profil*",
      responseText: data });
    item = FactoryGuy.make("item", { state: "submitted" , designation: designation});
    item1 = FactoryGuy.make("item", { state: "submitted", quantity: 10 , designation: designation});
    orders_package = FactoryGuy.make("orders_package", { state: "designated", quantity: 6, item: item, designation: designation });
    orders_package1 = FactoryGuy.make("orders_package", { state: "dispatched", quantity: 4, item: item1, designation: designation });

     visit("/orders/");

    fillIn('#searchText', designation.get("code"));
    andThen(function(){
      click(find('ul.list li:first div.row.state_details'));
    });

    mockFindAll('designation').returns({ json: {designations: [designation.toJSON({includeId: true})], items: [item.toJSON({includeId: true}), item1.toJSON({includeId: true})], orders_packages: [orders_package.toJSON({includeId: true}), orders_package1.toJSON({includeId: true})], meta: {search: designation.get('code').toString()}}});
    mockFindAll('orders_package').returns({ json: {orders_packages: [orders_package.toJSON({includeId: true}), orders_package1.toJSON({includeId: true})]}});
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test("Redirect to item search page on click of add item", function(assert) {
  click($('.add_item_button a'));
  andThen(function() {
    assert.equal(currentPath(), "orders.items");
  });
});
