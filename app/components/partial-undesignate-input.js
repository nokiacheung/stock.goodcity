import Ember from "ember";
import config from '../config/environment';

export default Ember.TextField.extend({
  value: "",
  id: '',
  tagName: "input",
  maxlength: "5",
  attributeBindings: [ "name", "id", "value", 'placeholder'],
  partial_qty_value: Ember.computed.alias('value'),
  designationPackage: null,
  ordersPackageQty: null,
  alreadyRendered: true,
  store: Ember.inject.service(),
  env: config.APP.environment,

  didRender() {
    if(this.get("env") === "test") {
      return false;
    }
    this.set('designationPackage', this.get('designationPackage'));
    if(this.get("alreadyRendered")) {
      this.set('value', this.get('designationPackage.quantity') + this.get("designationPackage.item.quantity"));
      this.set("alreadyRendered", false);
    }
  },

  triggerValueChange: Ember.observer('designationPackage.quantity', 'ordersPackageQty', function() {
    if(this.get("env") === "test") {
      return false;
    }
    this.set('value', this.get('designationPackage.quantity') + this.get("designationPackage.item.quantity"));
  }),

  focusIn() {
    if(this.get("env") === "test") {
      return false;
    }
    Ember.$(this.element).css("background-color", "#002352");
  },

  click() {
    if(this.get("env") === "test") {
      return false;
    }
    this.set('designationPackage', this.get('designationPackage'));
    Ember.$(this.element).css("background-color", "#002352");
  },

  focusOut() {
    if(this.get("env") === "test") {
      return false;
    }
    var regex = /^\d+$/;
    var input_value = this.get('value');
    if(input_value < 0 || parseInt(input_value) < 0 || parseInt(input_value) > (this.get('designationPackage.quantity') + this.get('designationPackage.item.quantity')) || !(regex.test(input_value))) {
      Ember.$(this.element).css("border", "1px solid #fddbdc");
      Ember.$('#undesignateButton')[0].disabled = true;
      this.$().focus();
      return false;
    }
  },

  focusTrigger: Ember.observer('value', 'designationPackage', function() {
    if(this.get("env") === "test") {
      return false;
    }
    var regex = /^\d+$/;
    var input_value = this.get('value');
    if(input_value < 0 || parseInt(input_value) < 0 || parseInt(input_value) > (this.get('designationPackage.quantity') + this.get('designationPackage.item.quantity'))|| !(regex.test(input_value))) {
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
