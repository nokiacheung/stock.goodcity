import Ember from "ember";

export default Ember.TextField.extend({
  item: null,
  value: "",
  tagName: "input",
  maxlength: "5",
  attributeBindings: [ "name", "id", "value", 'placeholder'],

  click() {
    this.set('qtyError', false);
    Ember.$(this.element).addClass('change-color');
  },

  didInsertElement(){
    Ember.$(this.element).addClass('change-color');
    return this.set('value', this.get('item.quantity').toString());
  },

  focusTrigger: Ember.observer('value', function() {
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
