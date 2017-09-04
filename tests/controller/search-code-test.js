import { test, moduleFor } from 'ember-qunit';
import startApp from '../helpers/start-app';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';
import Ember from 'ember';

var App;

moduleFor('controller:search_code', 'search_code controller', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();

  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test('calling the action clearSearch clears filter and searchtext', function(assert) {
  assert.expect(6);

  // get the controller instance
  var ctrl = this.subject();

  // check the properties before the action is triggered
  assert.equal(ctrl.get('filter'), '');
  assert.equal(ctrl.get('searchText'), '');
  assert.equal(ctrl.get('fetchMoreResult'), true);

  // trigger the action on the controller by using the `send` method,
  // passing in any params that our action may be expecting
  ctrl.send('clearSearch', false);

  // finally we assert that our values have been updated
  // by triggering our action.
  assert.equal(ctrl.get('filter'), '');
  assert.equal(ctrl.get('searchText'), '');
  assert.equal(ctrl.get('fetchMoreResult'), true);
});

test('calling the action cancelSearch cancels search', function(assert) {
  assert.expect(6);

  var ctrl = this.subject();

  assert.equal(ctrl.get('filter'), '');
  assert.equal(ctrl.get('searchText'), '');
  assert.equal(ctrl.get('fetchMoreResult'), true);

  ctrl.send('clearSearch');

  assert.equal(ctrl.get('filter'), '');
  assert.equal(ctrl.get('searchText'), '');
  assert.equal(ctrl.get('fetchMoreResult'), true);
});

test('calling the action assignItemLabel assigns Label to Item', function(assert) {
  assert.expect(2);

  var ctrl = this.subject();

  assert.equal(ctrl.get('isSearchCodePreviousRoute'), false);

  ctrl.send('assignItemLabel');

  assert.equal(ctrl.get('isSearchCodePreviousRoute'), true);
});
