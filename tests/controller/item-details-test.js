import { test, moduleFor } from 'ember-qunit';

moduleFor('controller:items.detail', 'items.detail controller', {
  needs: ['service:messageBox', 'service:i18n']
});

test('Checking for default set values', function(assert) {
  assert.expect(8);

  var controller = this.subject();

  assert.equal(controller.get('item'), null);
  assert.equal(controller.get('backLinkPath'), "");
  assert.equal(controller.get('queryParams')[0], "showDispatchOverlay");
  assert.equal(controller.get('showDispatchOverlay'), false);
  assert.equal(controller.get('autoDisplayOverlay'), false);
  assert.equal(controller.get('displayScanner'), false);
  assert.equal(controller.get('callOrderObserver'), false);
  assert.equal(controller.get('designateFullSet'), false);
});
