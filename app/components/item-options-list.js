import Ember from "ember";
const { getOwner } = Ember;

export default Ember.Component.extend({
  hidden: true,
  item: null,
  designateFullSet: Ember.computed.localStorage(),

  actions: {
    toggle(value) {
      this.set("hidden", value);
      var item = this.get("item");
      var itemOptionsLink = Ember.$('.options-link-open.' + item.id)[0];
      if(itemOptionsLink) {
        Ember.$('.receive-item-options.' + item.id).toggleClass("hidden");
        Ember.$('.options-link-open.' + item.id).toggleClass("hidden");
        return false;
      } else {
        return true;
      }
    },
    partialDesignateForSet() {
      this.set('designateFullSet', false);
      getOwner(this).lookup('controller:items.detail').set('callOrderObserver', true);
    }
  }
});
