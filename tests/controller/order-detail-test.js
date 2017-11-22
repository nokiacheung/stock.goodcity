import { run } from '@ember/runloop';
import { test, moduleFor } from 'ember-qunit';
import startApp from '../helpers/start-app';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';

var App;

moduleFor('controller:orders.detail', 'orders.detail controller', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
  },
  afterEach: function() {
    run(function() { TestHelper.teardown(); });
    run(App, 'destroy');
  }
});

test('calling displayAllItems action displays all item', function(assert) {
  assert.expect(2);

  // get the controller instance
  var ctrl = this.subject();

  assert.equal(ctrl.get('displayAllItems'), false);

  ctrl.send('displayAllItems');

  assert.equal(ctrl.get('displayAllItems'), true);
});

