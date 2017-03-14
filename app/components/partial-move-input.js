import Ember from "ember";
import config from '../config/environment';

export default Ember.TextField.extend({
  item: null,
  value: "",
  env: config.APP.environment,
  tagName: "input",
  maxlength: "5",
  attributeBindings: [ "name", "id", "value", 'placeholder'],

  click() {
    if(this.get("env") === "test") {
      return false;
    }
    this.set('qtyError', false);
    Ember.$(this.element).addClass('change-color');
  },

  didInsertElement(){
    if(this.get("env") === "test") {
      return false;
    }
    Ember.$(this.element).addClass('change-color');
    return this.set('value', this.get('item.quantity').toString());
  },

  focusTrigger: Ember.observer('value', function() {
    if(this.get("env") === "test") {
      return false;
    }
    var regex = /^\d+$/;
    var input_value = this.get('value');
    if(input_value < 0 || input_value > this.get('item.quantity') || !(input_value.trim()) || !(regex.test(input_value))) {
      Ember.$(this.element).css("border", "1px solid #fddbdc");
      Ember.$('#partial_move')[0].disabled = true;
      this.$().focus();
      return false;
    } else {
      Ember.$(this.element).css("border", "1px solid #8091a9");
      Ember.$('#partial_move')[0].disabled = false;
      return true;
    }
  }),
});
