import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import '../factories/item';
import '../factories/location';
import '../factories/designation';
import '../factories/code';
import FactoryGuy from 'ember-data-factory-guy';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';

var App, location1, designation, item;

module("Accessing un-invetorised items", {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    location1 = FactoryGuy.make("location");
    designation = FactoryGuy.make("designation", { state: "closed" });
    item = FactoryGuy.make("item", { inventoryNumber: null });
    $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
    items: [item.toJSON({includeId: true})]
    }
  });

  visit("items/"+item.id);
  },

  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
  }
});

test("Check 'This item is not inventorized yet or has been mark as missing.' message for un-invetorised items", function(assert) {
  assert.expect(1);


  andThen(function() {
    assert.equal($('#messageBoxText').text().trim(), "This item is not inventoried yet or has been marked as missing.");
  });

  andThen(function() {
    //Wayaround to remove messageBox
    $('#messageBox').remove();
    $('.reveal-modal-bg').remove();
  });
});
