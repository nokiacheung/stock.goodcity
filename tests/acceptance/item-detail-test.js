import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import '../factories/orders_package';
import '../factories/designation';
import '../factories/item';
import FactoryGuy from 'ember-data-factory-guy';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';

var App, pkg, pkg1, pkg2, order1, order2, orders_pkg1, orders_pkg2;

module('Acceptance: Item Detail', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    order1 = FactoryGuy.make("designation", { state: "closed" });
    order2 = FactoryGuy.make("designation", { state: "closed" });
    pkg = FactoryGuy.make("item", { state: "submitted" , quantity: 10});
    pkg1 = FactoryGuy.make("item", { state: "submitted" , designation: order2, quantity: 4});
    pkg2 = FactoryGuy.make("item", { state: "submitted" , designation: order2, quantity: 0});
    orders_pkg1 = FactoryGuy.make("orders_package", { state: "designated", quantity: 6, item: pkg1, designation: order1 });
    orders_pkg2 = FactoryGuy.make("orders_package", { state: "dispatched", quantity: 10, item: pkg2, designation: order2 });
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test("Available actions for non-designated item", function(assert) {
  assert.expect(2);
  $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
      items: [pkg.toJSON({includeId: true})]
      }
  });
  visit("/items/"+ pkg.id);
  andThen(function() {
    assert.equal(currentPath(), "items.detail");
    click($('.item_options_component div.options-link-open'));
    //dispatch disabled(all other options are enabled)
    assert.equal($('div.receive-item-options div:eq(4)')[0].className, 'disabled');
  });
});

test("Available actions for partially-designated item(qty > 0)", function(assert) {
  $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
      items: [pkg1.toJSON({includeId: true})]
      }
  });
  assert.expect(2);
  visit("/items/"+ pkg1.id);
  andThen(function() {
    assert.equal(currentPath(), "items.detail");
    click($('.item_options_component div.options-link-open'));
    //All actions are enabled including dispatch
    assert.equal($('div.receive-item-options div.disabled')[0], undefined);
  });
});

test("Available actions for fully-designated item(qty = 0)", function(assert) {
  $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
      items: [pkg2.toJSON({includeId: true})]
      }
  });
  assert.expect(3);
  visit("/items/"+ pkg2.id);
  andThen(function() {
    assert.equal(currentPath(), "items.detail");
    click($('.item_options_component div.options-link-open'));
    //Move is disabled as qty = 0
    assert.equal($('div.receive-item-options div.disabled:first').text().trim(), "Move");
    //designate is disabled
    assert.equal($('div.receive-item-options div.disabled:last').text().trim(), "designate");
  });
});

test("Redirects to history page", function(assert) {
  assert.expect(1);
  $.mockjax({url: '/api/v1/stockit_item*', type: 'GET', status: 200,responseText: {
      items: [pkg2.toJSON({includeId: true})]
      }
  });
  visit("/items/"+ pkg2.id);
  andThen(function() {
    click($('ul.small-block-grid-3 li:eq(2)'));
  });
  andThen(function() {
    assert.equal(currentPath(), "items.history");
  });
});

