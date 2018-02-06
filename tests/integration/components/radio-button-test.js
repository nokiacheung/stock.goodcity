import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

var App;

moduleForComponent('radio-button', 'Integration | Component | radio button', {
  integration: true,
  beforeEach: function() {
    App = startApp({}, 2);
    this.render(hbs`{{radio-button id="description"}}`);
  },
  afterEach: function() {
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

