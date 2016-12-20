import Ember from "ember";

export default Ember.TextField.extend({
  value: "",
  tagName: "input",
  type:    "number",
  maxlength: "5",
  attributeBindings: [ "name", "id", "value", 'placeholder', 'min', 'max'],
  partial_qty_value: Ember.computed.alias('value'),
  designationPackage: null,

  triggerValueChange: Ember.observer('designationPackage.quantity', function() {
    this.set('value', this.get('designationPackage.quantity'));
  }),

  click() {
    this.set('designationPackage', this.get('designationPackage'));
    this.set('qtyError', false);
    Ember.$(this.element).css("background-color", "#002352");
  },

  didRender() {
    this.set('designationPackage', this.get('designationPackage'));
  },

  focusTrigger: Ember.observer('value', function() {
    if(this.get('value') <= 0 || this.get('value') > this.get('designationPackage.quantity')) {
      Ember.$(this.element).css("border", "1px solid #fddbdc");
      Ember.$(`.${this.get('designationPackage.id')}`)[0].disabled = true;
      this.$().focus();
      return false;
    } else {
      Ember.$(this.element).css("border", "1px solid #8091a9");
      Ember.$(`.${this.get('designationPackage.id')}`)[0].disabled = false;
      return true;
    }
  }),
});
