import { test, moduleFor } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';
import FactoryGuy from 'ember-data-factory-guy';
import Ember from 'ember';

var App, item;

moduleFor('controller:items.index', 'items.index controller', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test('Checking for default set values', function(assert) {
  assert.expect(1);

  var ctrl = this.subject();

  assert.equal(ctrl.set('itemSetId'), "1");

  assert.equal(ctrl.get('searchModelName'), "item");
});

