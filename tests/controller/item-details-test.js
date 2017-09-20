import { test, moduleFor } from 'ember-qunit';
import startApp from '../helpers/start-app';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';
import Ember from 'ember';
// import FactoryGuy from 'ember-data-factory-guy';
// import '../factories/designation';

var App;

moduleFor('controller:items.detail', 'items.detail controller', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    // designation = FactoryGuy.make("designation");
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test('Checking for default set values', function(assert) {
  assert.expect(9);

  // get the controller instance
  var ctrl = this.subject();

  assert.equal(ctrl.get('item'), null);
  assert.equal(ctrl.get('backLinkPath'), "");
  assert.equal(ctrl.get('queryParams')[0], "showDispatchOverlay");
  assert.equal(ctrl.get('showDispatchOverlay'), false);
  assert.equal(ctrl.get('autoDisplayOverlay'), false);
  assert.equal(ctrl.get('displayScanner'), false);
  assert.equal(ctrl.get('callOrderObserver'), false);
  assert.equal(ctrl.get('messageBox'), null);
  assert.equal(ctrl.get('designateFullSet'), false);
});
