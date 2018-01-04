import Ember from "ember";
const { getOwner } = Ember;

export default Ember.Component.extend({
  hidden: true,
  item: null,
  designateFullSet: Ember.computed.localStorage(),

  toggleItemClass() {
    var item = this.get("item");
    Ember.$('.receive-item-options.' + item.id).toggleClass("hidden");
    Ember.$('.options-link-open.' + item.id).toggleClass("hidden");
  },

  actions: {
    toggle(value) {
      this.set("hidden", value);
      var item = this.get("item");
      var itemOptionsLink = Ember.$('.options-link-open.' + item.id)[0];
      var optionsLink = Ember.$('.options-link-open.hidden');
      if(optionsLink.length) {
        Ember.$('.receive-item-options').not('.hidden').toggleClass('hidden');
        Ember.$('.options-link-open.hidden').toggleClass('hidden');
        //this.toggleItemClass();
        return false;
      } else if(itemOptionsLink) {
        this.toggleItemClass();
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
