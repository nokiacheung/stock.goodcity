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
    location1 = FactoryGuy.make("location");
    designation = FactoryGuy.make("designation", { state: "closed" });
    mockFindAll('designation').returns({json: {designations: [designation.toJSON({includeId: true})]}});
    mockFindAll('location').returns({json: {locations: [location1.toJSON({includeId: true})]}});
    code = FactoryGuy.make("code", {location: location1});
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test("Check validation for 'Add item to inventory ' page''", function(assert) {
  assert.expect(5);

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
      fillIn('#qty', '');
      $('.remove-text').click();
      assert.equal($('#description').val(), '');
      click($('.button.expand').last());
      andThen(function() {
        assert.equal($('#qty').siblings('.input-error').is(":visible"), true);
        assert.equal($('#description').siblings('.input-error').is(":visible"), true);
        // click($('.button.secondary.expand'));
        // andThen(function() {
        //   click($('#btn1'));
        // });
        //
        // andThen(function() {
        //   assert.equal(currentPath(), "/");
        // });
      });
    });
  });
});



test("Redirect to /search_code after clicking Add item to inventory and save redirects to items details page", function(assert) {
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

        var loc = FactoryGuy.make("location", { id: 7 });
        var pkgLocation = FactoryGuy.make("packages_location", {id: 764, location: loc});
        var pkg = FactoryGuy.make("item", { id: 971, quantity: 1,  notes: "Baby Crib, Set (frame, mattress)", inventoryNumber:"000317", "package_type_id":9, packageLocations: [ pkgLocation ]  });
        var code1 = FactoryGuy.make("code", { id: 9, name: "Baby Crib, Set (frame, mattress)", code: "BBS", location: loc  });

        $.mockjax({url:"/api/v1/package*", type: 'POST', status: 200,responseText:{
          item : pkg.toJSON({includeId: true}),
          code : [ code1.toJSON({includeId: true}) ],
          locations: [ loc.toJSON({includeId: true}) ],
          packages_locations:[pkgLocation.toJSON({includeId: true})]
          }});

        $.mockjax({url:"api/v1/stockit_items/*", type: 'GET', status: 200,responseText:{
          item : pkg.toJSON({includeId: true}),
          code : [ code1.toJSON({includeId: true}) ],
          locations: [ loc.toJSON({includeId: true}) ],
          packages_locations:[pkgLocation.toJSON({includeId: true})]
        }});

        andThen(function() {
          assert.equal(currentPath(), "items.detail");
        });
      });

  });
});
