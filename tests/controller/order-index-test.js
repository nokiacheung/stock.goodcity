import { test, moduleFor } from 'ember-qunit';
import startApp from '../helpers/start-app';
import Ember from 'ember';

var App;

moduleFor('controller:orders.index', 'orders.index controller', {
  beforeEach: function() {
    App = startApp({}, 2);
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
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

