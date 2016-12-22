import Ember from "ember";

export default Ember.TextField.extend({
  value: "",
  tagName: "input",
  type:    "number",
  maxlength: "5",
  attributeBindings: [ "name", "id", "value", 'placeholder', 'min', 'max'],
  partial_qty_value: Ember.computed.alias('value'),
  designationPackage: null,
  store: Ember.inject.service(),

  didRender() {
    this.set('designationPackage', this.get('designationPackage'));
  },

  triggerValueChange: Ember.observer('designationPackage.quantity', function() {
    this.set('value', this.get('designationPackage.quantity'));
  }),

  focusIn() {
    Ember.$(this.element).css("background-color", "#002352");
  },

  click() {
    this.set('designationPackage', this.get('designationPackage'));
    this.set('qtyError', false);
    Ember.$(this.element).css("background-color", "#002352");
  },

  focusTrigger: Ember.observer('value', function() {
    var id=this.get('designationPackage.packageId');
    var orderspackages = this.get('store').peekAll('orders_package').filterBy('packageId', id).filterBy('quantity');
    var orderpackagesIds = orderspackages.getEach('id');
    var total = 0;
    orderpackagesIds.forEach(id => {
      total += parseInt(Ember.$(`#${id}`)[0].value);
    });
    if(this.get('value') < 0 || parseInt(this.get('value')) < 0 || parseInt(this.get('value')) > this.get('designationPackage.quantity')) {
      Ember.$(this.element).css("border", "1px solid #fddbdc");
      Ember.$('#undesignateButton')[0].disabled = true;
      this.$().focus();
      return false;
    } else {
      Ember.$(this.element).css("border", "1px solid #8091a9");
      Ember.$('#undesignateButton')[0].disabled = false;
      return true;
    }
  }),
});
