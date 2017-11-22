import { computed } from '@ember/object';
import Component from '@ember/component';
import { getOwner } from '@ember/application';

export default Component.extend({
  hidden: true,
  item: null,
  designateFullSet: computed.localStorage(),

  actions: {
    toggle(value) {
      this.set("hidden", value);
    },
    partialDesignateForSet() {
      this.set('designateFullSet', false);
      getOwner(this).lookup('controller:items.detail').set('callOrderObserver', true);
    }
  }
});
