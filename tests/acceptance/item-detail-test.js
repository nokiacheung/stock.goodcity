import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import '../factories/orders_package';
import '../factories/designation';
import '../factories/item';
import '../factories/location';
import FactoryGuy from 'ember-data-factory-guy';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';

var App, item, item1, item2, designation1, designation2, orders_package1, orders_package2;

module('Order search list', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    designation1 = FactoryGuy.make("designation", { state: "closed" });
    designation2 = FactoryGuy.make("designation", { state: "closed" });
    item = FactoryGuy.make("item", { state: "submitted" , quantity: 10});
    item1 = FactoryGuy.make("item", { state: "submitted" , designation: designation2, quantity: 4});
    item2 = FactoryGuy.make("item", { state: "submitted" , designation: designation2, quantity: 0});
    orders_package1 = FactoryGuy.make("orders_package", { state: "designated", quantity: 6, item: item1, designation: designation1 });
    orders_package2 = FactoryGuy.make("orders_package", { state: "dispatched", quantity: 10, item: item2, designation: designation2 });
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test("Available actions for non-designated item", function(assert) {
  assert.expect(2);
  $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
      items: [item.toJSON({includeId: true})]
      }
  });
  visit("/items/"+ item.id);
  andThen(function() {
    assert.equal(currentPath(), "items.detail");
    click(find('.item_options_component div.options-link-open'));
    //dispatch disabled(all other options are enabled)
    assert.equal(find('div.receive-item-options div:eq(4)')[0].className, 'disabled');
  });
});

test("Available actions for partially-designated item(qty > 0)", function(assert) {
  $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
      items: [item1.toJSON({includeId: true})]
      }
  });
  assert.expect(2);
  visit("/items/"+ item1.id);
  andThen(function() {
    assert.equal(currentPath(), "items.detail");
    click(find('.item_options_component div.options-link-open'));
    //All actions are enabled including dispatch
    assert.equal(find('div.receive-item-options div.disabled')[0], undefined);
  });
});

test("Available actions for fully-designated item(qty = 0)", function(assert) {
  $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
      items: [item2.toJSON({includeId: true})]
      }
  });
  assert.expect(3);
  visit("/items/"+ item2.id);
  andThen(function() {
    assert.equal(currentPath(), "items.detail");
    click(find('.item_options_component div.options-link-open'));
    //Move is disabled as qty = 0
    assert.equal(find('div.receive-item-options div.disabled:first').text().trim(), "Move");
    //designate is disabled
    assert.equal(find('div.receive-item-options div.disabled:last').text().trim(), "designate");
  });
});

test("Redirects to history page", function(assert) {
  assert.expect(1);
  $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
      items: [item2.toJSON({includeId: true})]
      }
  });
  visit("/items/"+ item2.id);
  andThen(function() {
    click(find('ul.small-block-grid-3 li:eq(2)'));
  });
  andThen(function() {
    assert.equal(currentPath(), "items.history");
  });
});

