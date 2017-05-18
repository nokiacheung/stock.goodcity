import Ember from "ember";
const { getOwner } = Ember;

export default Ember.Component.extend({
  hidden: true,
  item: null,
  designateFullSet: Ember.computed.localStorage(),

  actions: {
    toggle(value) {
      this.set("hidden", value);
    },
    partialDesignateForSet() {
      this.set('designateFullSet', false);
      getOwner(this).lookup('controller:items.detail').set('callOrderObserver', true);
    },
  }
});
