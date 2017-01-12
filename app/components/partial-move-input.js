import Ember from "ember";

export default Ember.TextField.extend({
  item: null,
  value: "",
  tagName: "input",
  type:    "number",
  maxlength: "5",
  attributeBindings: [ "name", "id", "value", 'placeholder', 'min', 'max'],

  click() {
    this.set('qtyError', false);
    Ember.$(this.element).addClass('change-color');
  },

  didInsertElement(){
    return this.set('value', this.get('item.quantity').toString());
  },

  focusTrigger: Ember.observer('value', function() {
    if(this.get('value') < 0 || this.get('value') > this.get('item.quantity') || !(this.get('value').trim())) {
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
