import { test, moduleFor } from 'ember-qunit';
import startApp from '../helpers/start-app';
import Ember from 'ember';
import FactoryGuy from 'ember-data-factory-guy';
import '../factories/designation';

var App, designation;

moduleFor('controller:items.search_order', 'items.search_order controller', {
  beforeEach: function() {
    App = startApp({}, 2);
    designation = FactoryGuy.make("designation");
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('Checking for default set values', function(assert) {
  assert.expect(12);

  // get the controller instance
  var ctrl = this.subject();

  assert.equal(ctrl.get('isSet'), null);
  assert.equal(ctrl.get('isSet'), null);
  assert.equal(ctrl.get('showDispatchOverlay'), false);
  assert.equal(ctrl.get('toDesignateItem'), true);
  assert.equal(ctrl.get('partial_qty'), 0);
  assert.equal(ctrl.get('notPartialRoute'), false);
  assert.equal(ctrl.get('searchModelName'), "designation");
  assert.equal(ctrl.get('sortProperties')[0], "recentlyUsedAt:desc");
  assert.equal(ctrl.get('displayUserPrompt'), false);
  assert.equal(ctrl.get('showAllSetItems'), false);
  assert.equal(ctrl.get('selectedDesignation'), null);
  assert.equal(ctrl.get('toggleOverlay'), true);
});

test('calling setOrder action sets order and toggles overlay', function(assert) {
  assert.expect(2);

  // get the controller instance
  var ctrl = this.subject();

  assert.equal(ctrl.get('toggleOverlay'), true);

  ctrl.send('setOrder', designation);

  assert.equal(ctrl.get('toggleOverlay'), false);
});

test('calling displayMoveOverlay action sets order and displays user prompt', function(assert) {
  assert.expect(4);

  // get the controller instance
  var ctrl = this.subject();

  assert.equal(ctrl.get('displayUserPrompt'), false);
  assert.equal(ctrl.get('selectedDesignation'), null);

  ctrl.send('displayMoveOverlay', designation);

  assert.equal(ctrl.get('displayUserPrompt'), true);
  assert.equal(ctrl.get('selectedDesignation'), designation);
});

