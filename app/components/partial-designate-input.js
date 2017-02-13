import Ember from "ember";

export default Ember.TextField.extend({
  item: null,
  value: "",
  tagName: "input",
  maxlength: "5",
  attributeBindings: [ "name", "id", "value", 'placeholder'],
  partial_qty_value: Ember.computed.alias('value'),
  designateFullSet: Ember.computed.localStorage(),

  minSetQty: Ember.computed('item.setItem.items', function() {
    if(this.get('item.isSet') && this.get('designateFullSet')) {
      var setItems = this.get('item.setItem.items');
      var minQty = setItems.canonicalState[0]._data.quantity;
      setItems.canonicalState.forEach(record =>{
        var qty = record._data.quantity;
        if(qty < minQty) {
          minQty = qty;
        }
      });
      return minQty;
    }
  }),

  didInsertElement() {
    Ember.$(this.element).css("background-color", "#002352");
    this.set('value', this.get('minSetQty') || this.get('item.quantity'));
  },

  click() {
    Ember.$(this.element).css("background-color", "#002352");
  },

  focusOut() {
    var regex = /^\d+$/;
    var input_value = this.get('value');
    if(input_value <= 0 || (this.get('item.isSet') && input_value > this.get('minSetQty')) || input_value > this.get('item.quantity') || !(regex.test(input_value))) {
      Ember.$(this.element).css("border", "1px solid #fddbdc");
      Ember.$('#partial_designate')[0].disabled = true;
      this.$().focus();
      return false;
    }
  },

  focusTrigger: Ember.observer('value', function() {
    var regex = /^\d+$/;
    var input_value = this.get('value');
    if(input_value <= 0 || (this.get('item.isSet') && input_value > this.get('minSetQty')) || input_value > this.get('item.quantity') || !(regex.test(input_value))) {
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
