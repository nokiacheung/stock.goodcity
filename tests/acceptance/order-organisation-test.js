import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import '../factories/orders_package';
import '../factories/designation';
import '../factories/gc_organisation';
import '../factories/item';
import FactoryGuy from 'ember-data-factory-guy';
import { mockFindAll } from 'ember-data-factory-guy';

var App, designation, item, item1, orders_package, orders_package1, org;

module('Acceptance: Order Organisation', {
  beforeEach: function() {
    App = startApp({}, 2);
    org = FactoryGuy.make("gc_organisation");
    designation = FactoryGuy.make("designation", { detailType: 'Goodcity', gcOrganisationId: org.id, gc_organisation: org });
    item = FactoryGuy.make("item", { state: "submitted" , designation: designation});
    item1 = FactoryGuy.make("item", { state: "submitted", quantity: 10 , designation: designation});
    orders_package = FactoryGuy.make("orders_package", { state: "designated", quantity: 6, item: item, designation: designation });
    orders_package1 = FactoryGuy.make("orders_package", { state: "dispatched", quantity: 4, item: item1, designation: designation });
    var data = {"user_profile": {"id": 2, "first_name": "David", "last_name": "Dara51", "mobile": "61111111", "permission_id": 4}, "permissions": [{"id": 4, "name": "Supervisor"}]};

    $.mockjax({url:"/api/v1/auth/current_user_profil*",
      responseText: data });

    visit("/");

    andThen(function() {
      visit("/orders/");
    });

    fillIn('#searchText', designation.get("code"));
    andThen(function(){
      click(find('ul.list li:first div.row.state_details'));
    });

    mockFindAll('designation').returns({ json: {designations: [designation.toJSON({includeId: true})], items: [item.toJSON({includeId: true}), item1.toJSON({includeId: true})], gcOrganisations: [org.toJSON({includeId: true})], orders_packages: [orders_package.toJSON({includeId: true}), orders_package1.toJSON({includeId: true})], meta: {search: designation.get('code').toString()}}});
    mockFindAll('orders_package').returns({ json: {orders_packages: [orders_package.toJSON({includeId: true}), orders_package1.toJSON({includeId: true})]}});
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test("Check order Organisation", function(assert) {
  assert.expect(2);

  andThen(function() {
    assert.equal(currentPath(), "orders.detail");
    assert.equal($('.title').text().substr(-1), org.id);
  });
});
