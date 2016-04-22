import Ember from "ember";

export default Ember.TextField.extend({
  tagName: "input",
  type:    "text",
  attributeBindings: [ "name", "id", "value", 'placeholder'],

  didInsertElement() {
    this.$().focus();
  }
});
