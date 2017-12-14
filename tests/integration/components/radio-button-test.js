import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

var App;

moduleForComponent('radio-button', 'Integration | Component | radio button', {
  integration: true,
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    this.render(hbs`{{radio-button id="description"}}`);
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
    Ember.run(App, 'destroy');
  }
});

test('is an input tag', function(assert) {
  assert.expect(1);
  assert.equal($('#description').prop('tagName'), 'INPUT');
});

test('is of radio type', function(assert) {
  assert.expect(1);
  assert.equal($('#description')[0].type, "radio");
});

