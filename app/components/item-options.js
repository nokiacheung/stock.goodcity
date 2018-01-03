import Ember from "ember";

export default Ember.Component.extend({
  hidden: true,

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
    }
  }
});
