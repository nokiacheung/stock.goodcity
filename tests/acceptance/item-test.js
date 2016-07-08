import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import FactoryGuy from 'ember-data-factory-guy';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';
import { mockFindAll } from 'ember-data-factory-guy';
import '../factories/item';

var App, item;

module('Acceptance: Item', {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    item = FactoryGuy.make('item');
  },
  afterEach: function() {
    Ember.run(function () { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test('visiting /items', function(assert) {
  assert.expect(1);
  visit('/items');

  mockFindAll('item').returns({ json: {items: [item.toJSON({includeId:true})]} });

  fillIn('#searchText', item.get('notes'));
  andThen(function() {
    assert.equal(find('ul div.item_block div.item_details div.name_details div').last().text().trim(), item.get('notes'));
  });
});
