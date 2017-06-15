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

var App, location1, designation, code;

module('Acceptance: Add item to inventory', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    visit("/");
    location1 = FactoryGuy.make("location", {id: 7});
    designation = FactoryGuy.make("designation", { state: "closed" });
    packages_location = FactoryGuy.make("packages_location", {"id": 764,"package_id": 971,location: location1, item: 971});
    code = FactoryGuy.make("code", {id: 9, location: location1});
    item = FactoryGuy.make("item", {id: 971, code: code, packages_location: [packages_location]});

    mockFindAll('packages_location').returns({json: {packages_locations: [packages_location.toJSON({includeId: true})]}});
    mockFindAll('code').returns({json: {codes: [code.toJSON({includeId: true})]}});
    mockFindAll('item').returns({json: {items: [item.toJSON({includeId: true})]}});
    mockFindAll('designation').returns({json: {designations: [designation.toJSON({includeId: true})]}});
    mockFindAll('location').returns({json: {locations: [location1.toJSON({includeId: true})]}});


  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test("Redirect to /search_code after clicking Add item to inventory", function(assert) {
  assert.expect(14);

  $.mockjax({url: '/api/v1/package_type*', type: 'GET', status: 200,responseText: {
      codes: [code.toJSON({includeId: true})]
    }
  });
  click($('.center-text a'));
  andThen(function() {
    assert.equal(currentPath(), "search_code");
    fillIn("#searchText", code.get('name'));
    click($('.list li:first')[0]);
    $.mockjax({url:"/api/v1/inventory*", type: 'POST', status: 200,responseText:{"inventory_number":"000311"}});
    $.mockjax({url:"/api/v1/images/generate_sign*", type: 'GET', status: 200,responseText:{"api_key":123456789876543,"signature":"3ec17bf700bc23446d61932385d","timestamp":1234567891,"tags":"staging"}});
    andThen(function() {
      assert.equal(currentPath(), "items.new");
      //fillIn("#searchText", "Baby Crib");
      assert.equal($('#qty').val(), '1');
      assert.equal($('.columns .left input').last().val(), code.get('name'));
      assert.equal($('#description').val(), code.get('name'));
      assert.equal($('#height').val(), "");
      assert.equal($('#width').val(), "");
      assert.equal($('#length').val(), "");
      assert.equal($('label select').val(), "B");
      assert.equal($('#condition-select').val(), "U");
      assert.equal($('.small-9.columns input').first().val(), "");
      assert.equal($('.small-9.columns input').last().val(), location1.get('building')+location1.get('area'));
      assert.equal($('.inventory-number').text().match(/\d+/g)[0], "000311");
    });
    andThen(function() {
        click($('.button.expand').last());

        $.mockjax({url:"/api/v1/package*", type: 'POST', status: 200,responseText:{
          "item" :  item,
          "code": code,
          "locations":[location1],
          " packages_locations":[{"id":764,"package_id":971,location: location1,item_id:971}]
          }});

        //api/v1/stockit_items/971
        $.mockjax({url:"api/v1/stockit_items/*", type: 'GET', status: 200,responseText:{"item":{"id":971,"quantity":1,"length":null,"width":null,"height":null,"notes":"Baby Crib, Set (frame, mattress)","inventory_number":"000317","created_at":"2017-05-19T11:50:42.179786","updated_at":"2017-05-19T11:50:42.179786","item_id":null,"is_set":false,"grade":"B","code_id":9,"received_quantity":1,"package_type_id":9,"order_id":null,"packages_location_ids":[764],"image_ids":[],"orders_package_ids":[]},

          "code":[{"id":9,"name":"Baby Crib, Set (frame, mattress)","code":"BBS","other_child_packages":"FXX","default_child_packages":"BBS,BBM,BBC","other_terms":"Cot","visible_in_selects":true,"location_id":262}],
          "locations":[{"id":7,"building":"24","area":"D","stockit_id":7}],
          "packages_locations":[{"id":764,"package_id":971,"location_id":7,"quantity":1,"item_id":971}],
        }});
        andThen(function() {
          // $('.right.button').last().click(function (event) {
          //   event.preventDefault();
          // });
          // andThen(function() {
             assert.equal(currentPath(), "items.detail");
          // });
        });
      });

  });
});



