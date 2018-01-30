import { test, moduleFor } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';
import FactoryGuy from 'ember-data-factory-guy';
import Ember from 'ember';

var App, item;

moduleFor('controller:items.partial_designate', 'items.partial_designate controller', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    item = FactoryGuy.make("item");
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test('Checking for default set values', function(assert) {
  assert.expect(2);

  var ctrl = this.subject();

  assert.equal(ctrl.get('item'), null);
  assert.equal(ctrl.get('partial_qnty'), 0);
});

test('totalInHandItems returns items quantity', function(assert){
  assert.expect(1);

  var ctrl = this.subject();

  ctrl.set('item', item);

  assert.equal(ctrl.get('totalInHandItems'), item.get('quantity'));
});
