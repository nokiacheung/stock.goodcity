import { test, moduleFor } from 'ember-qunit';
import startApp from '../helpers/start-app';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';
import Ember from 'ember';

var App;

moduleFor('controller:items.detail', 'items.detail controller', {
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
  assert.expect(9);

  var controller = this.subject();

  assert.equal(controller.get('item'), null);
  assert.equal(controller.get('backLinkPath'), "");
  assert.equal(controller.get('queryParams')[0], "showDispatchOverlay");
  assert.equal(controller.get('showDispatchOverlay'), false);
  assert.equal(controller.get('autoDisplayOverlay'), false);
  assert.equal(controller.get('displayScanner'), false);
  assert.equal(controller.get('callOrderObserver'), false);
  assert.equal(controller.get('messageBox'), null);
  assert.equal(controller.get('designateFullSet'), false);
});
