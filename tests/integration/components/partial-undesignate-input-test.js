import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import TestHelper from 'ember-data-factory-guy/factory-guy-test-helper';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

var App;

moduleForComponent('partial-undesignate-input', 'Integration | Component | partial undesignate input', {
  integration: true,
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    this.render(hbs`{{partial-undesignate-input id=1 value=1}}`);
  },
  afterEach: function() {
    Ember.run(function() { TestHelper.teardown(); });
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
