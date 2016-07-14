import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';
import FactoryGuy from 'ember-data-factory-guy';
import '../factories/designation';
import '../factories/item';
import { mockFindAll } from 'ember-data-factory-guy';

var App, designation, item;

module('Acceptance: Order', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    item = FactoryGuy.make('item');
    designation = FactoryGuy.make("designation_with_item", {item:item});
  },
  afterEach: function() {
    Ember.run(function () { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test('visiting /orders', function(assert) {
  assert.expect(1);
  visit('/orders');
  mockFindAll('designation').returns({ json: {designations: [designation.toJSON({includeId: true})], meta: {search: designation.get('code').toString()}}});

  fillIn('#searchText', designation.get('code'));
  andThen(function() {
    assert.equal(find('ul.list li:first div div').text().split('-')[0].trim(), designation.get('code'));
  });
});
