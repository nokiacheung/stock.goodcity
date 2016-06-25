import Ember from "ember";

export default Ember.Component.extend({
  hidden: true,

  actions: {
    toggle(value) {
      this.set("hidden", value);
    }
  }
});
