import { test, moduleFor } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';
import FactoryGuy from 'ember-data-factory-guy';
import Ember from 'ember';

var App;

moduleFor('controller:items.partial_move', 'items.partial_move controller', {
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
  assert.expect(4);

  var ctrl = this.subject();

  assert.equal(ctrl.get('item'), null);
  assert.equal(ctrl.get('isZeroQuantity'), false);
  assert.equal(ctrl.get('originalQty'), null);
  assert.equal(ctrl.get('isEditing'), false);
});

test('editPackagesLocation sets isEditing and packagesLocation isEditing property', function(assert){
  var packagesLocation = FactoryGuy.make('packages_location');

  assert.expect(2);

  var ctrl = this.subject();

  ctrl.send('editPackagesLocation', packagesLocation);

  assert.equal(ctrl.get('isEditing'), true);
  assert.equal(packagesLocation.get('isEditing'), true);
});

test('notNow sets isEditing and packagesLocation isEditing to false', function(assert){
  var item = FactoryGuy.make('item');

  var ctrl = this.subject();

  ctrl.send('notNow', item);

  assert.equal(ctrl.get('isEditing'), false);
});
