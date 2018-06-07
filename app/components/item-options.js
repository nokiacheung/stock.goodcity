import Ember from "ember";
import singletonItemDispatchToGcOrder from '../mixins/singleton_item_dispatch_to_gc_order';

export default Ember.Component.extend(singletonItemDispatchToGcOrder, {
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
