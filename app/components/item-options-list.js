import Ember from "ember";

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
    },
  }
});
