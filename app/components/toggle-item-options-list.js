import Ember from 'ember';

export default Ember.Component.extend({
  item: null,

  click() {
    var item = this.get("item");
    var itemOptionsLink = Ember.$('.options-link-open.hidden.' + item.id)[0];
    if(itemOptionsLink) {
      Ember.$('.receive-item-options.' + item.id).toggleClass("hidden");
      Ember.$('.options-link-open.' + item.id).toggleClass("hidden");
      return false;
    } else {
      return true;
    }
  }
});

