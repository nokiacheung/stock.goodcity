import { test, moduleFor } from 'ember-qunit';
import startApp from '../helpers/start-app';
import Ember from 'ember';

var App;

moduleFor('controller:orders.detail', 'orders.detail controller', {
  beforeEach: function() {
    App = startApp({}, 2);
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
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

