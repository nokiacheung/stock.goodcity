import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

var App;

moduleForComponent('partial-move-input', 'Integration | Component | partial move input', {
  integration: true,
  beforeEach: function() {
    App = startApp({}, 2);
    this.render(hbs`{{partial-move-input id=1}}`);
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('is an input tag', function(assert) {
  assert.expect(1);
  assert.equal($('#1').prop('tagName'), 'INPUT');
});

test('is of text type', function(assert) {
  assert.expect(1);
  assert.equal($('#1')[0].type, "text");
});

test('maximum allowed characters are 5', function(assert) {
  assert.expect(1);
  assert.equal($('#1')[0].maxLength, 5);
});
