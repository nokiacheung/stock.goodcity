import Ember from "ember";

export default Ember.Component.extend({
  hidden: true,
  item: null,

  actions: {
    toggle(value) {
      this.set("hidden", value);
    }
  }
});
