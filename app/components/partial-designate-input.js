import Ember from "ember";

export default Ember.TextField.extend({
  item: null,
  value: "",
  tagName: "input",
  type:    "number",
  maxlength: "5",
  attributeBindings: [ "name", "id", "value", 'placeholder', 'min', 'max'],
  partial_qty_value: Ember.computed.alias('value'),

  click() {
    this.set('qtyError', false);
    Ember.$(this.element).css("background-color", "#002352");
  },

  focusTrigger: Ember.observer('value', function() {
    if(this.get('value') <= 0 || this.get('value') > this.get('item.quantity')) {
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

  triggerAutofocus: Ember.observer("value", function() {
    if (this.get('value').length === 0) {
      this.$().focus();
    }
  }),
});
