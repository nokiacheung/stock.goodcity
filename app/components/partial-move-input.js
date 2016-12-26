import Ember from "ember";
const { getOwner } = Ember;


export default Ember.TextField.extend({
  item: null,
  value: "",
  tagName: "input",
  type:    "number",
  maxlength: "5",
  attributeBindings: [ "name", "id", "value", 'placeholder', 'min', 'max'],
  partial_qty_value: Ember.computed.alias('value'),
  originalItemValue: null,

  click() {
    this.set('qtyError', false);
    Ember.$(this.element).css("background-color", "#002352");
  },

  focusTrigger: Ember.observer('value', function() {

    if(!(this.get('item').changedAttributes()['quantity'] === undefined)){
      this.set('originalItemValue', this.get('item').changedAttributes()['quantity'][0]);
    }

    var originalQty = this.get('originalItemValue') || this.get('item.quantity');

    getOwner(this).lookup('controller:items.partial_move').set('originalQty', originalQty);

    if(this.get('value') < 0 || this.get('value') > this.get('originalItemValue') || !(this.get('value').trim())) {
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
