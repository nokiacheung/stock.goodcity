import Ember from "ember";

export default Ember.TextField.extend({
  value: "",
  tagName: "input",
  maxlength: "5",
  attributeBindings: [ "name", "id", "value", 'placeholder'],
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
    Ember.$(this.element).css("background-color", "#002352");
  },

  focusOut() {
    var regex = /^\d+$/;
    var input_value = this.get('value');
    if(input_value < 0 || parseInt(input_value) < 0 || parseInt(input_value) > this.get('designationPackage.quantity') || !(regex.test(input_value))) {
      Ember.$(this.element).css("border", "1px solid #fddbdc");
      Ember.$('#undesignateButton')[0].disabled = true;
      this.$().focus();
      return false;
    }
  },

  focusTrigger: Ember.observer('value', function() {
    var regex = /^\d+$/;
    var input_value = this.get('value');
    var id=this.get('designationPackage.packageId');
    var orderspackages = this.get('store').peekAll('orders_package').filterBy('packageId', id).filterBy('quantity').filterBy("state", "designated");
    var orderpackagesIds = orderspackages.getEach('id');
    var total = 0;
    orderpackagesIds.forEach(id => {
      total += parseInt(Ember.$(`#${id}`)[0].value);
    });
    if(input_value < 0 || parseInt(input_value) < 0 || parseInt(input_value) > this.get('designationPackage.quantity') || !(regex.test(input_value))) {
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
