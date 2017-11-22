import { run } from '@ember/runloop';
import { test, moduleFor } from 'ember-qunit';
import startApp from '../helpers/start-app';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';

var App;

moduleFor('controller:orders.index', 'orders.index controller', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
  },
  afterEach: function() {
    run(function() { TestHelper.teardown(); });
    run(App, 'destroy');
  }
});

test('checking default set properties', function(assert) {
  assert.expect(3);

  // get the controller instance
  var ctrl = this.subject();

  assert.equal(ctrl.get('searchModelName'), "designation");
  assert.equal(ctrl.get('unloadAll'), true);
  assert.equal(ctrl.get('minSearchTextLength'), 2);
});

