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
    Ember.$(this.element).css("background-color", "#002352");
  },

  didInsertElement(){
    var quantity = this.get('item.quantity');
    if(quantity){
      return this.set('value', quantity.toString());
    }
  },

  focusTrigger: Ember.observer('value', function() {
    if(this.get('value') < 0 || this.get('value') > this.get('item.quantity') || !(this.get('value').trim())) {
      Ember.$(this.element).css("border", "1px solid #fddbdc");
      Ember.$('#partial_designate')[0].disabled = true;
      this.$().focus();
      return false;
    } else {
      Ember.$(this.element).css("border", "1px solid #8091a9");
      Ember.$('#partial_designate')[0].disabled = false;
      return true;
    }
  }),
});
