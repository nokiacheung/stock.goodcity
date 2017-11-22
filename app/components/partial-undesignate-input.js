import $ from 'jquery';
import { observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import TextField from '@ember/component/text-field';
import config from '../config/environment';

export default TextField.extend({
  value: "",
  id: '',
  tagName: "input",
  maxlength: "5",
  attributeBindings: [ "name", "id", "value", 'placeholder'],
  partial_qty_value: alias('value'),
  designationPackage: null,
  ordersPackageQty: null,
  alreadyRendered: true,
  store: service(),
  env: config.APP.environment,

  didRender() {
    if(this.get("env") === "test") {
      return false;
    }
    this.set('designationPackage', this.get('designationPackage'));
    if(this.get("alreadyRendered")) {
      this.set('value', this.get('designationPackage.quantity'));
      this.set("alreadyRendered", false);
    }
  },

  triggerValueChange: observer('designationPackage.quantity', 'ordersPackageQty', function() {
    if(this.get("env") === "test") {
      return false;
    }
    this.set('value', this.get('designationPackage.quantity'));
  }),

  focusIn() {
    if(this.get("env") === "test") {
      return false;
    }
    $(this.element).css("background-color", "#002352");
  },

  click() {
    if(this.get("env") === "test") {
      return false;
    }
    this.set('designationPackage', this.get('designationPackage'));
    $(this.element).css("background-color", "#002352");
  },

  focusOut() {
    if(this.get("env") === "test") {
      return false;
    }
    var regex = /^\d+$/;
    var input_value = this.get('value');
    if(input_value < 0 || parseInt(input_value, 10) < 0 || parseInt(input_value, 10) > (this.get('designationPackage.quantity') + this.get('designationPackage.item.quantity')) || !(regex.test(input_value))) {
      $(this.element).css("border", "1px solid #fddbdc");
      $('#undesignateButton')[0].disabled = true;
      this.$().focus();
      return false;
    }
  },

  focusTrigger: observer('value', 'designationPackage', function() {
    if(this.get("env") === "test") {
      return false;
    }
    var regex = /^\d+$/;
    var input_value = this.get('value');
    if(input_value < 0 || parseInt(input_value, 10) < 0 || parseInt(input_value, 10) > (this.get('designationPackage.quantity') + this.get('designationPackage.item.quantity'))|| !(regex.test(input_value))) {
      $(this.element).css("border", "1px solid #fddbdc");
      $('#undesignateButton')[0].disabled = true;
      this.$().focus();
      return false;
    } else {
      $(this.element).css("border", "1px solid #8091a9");
      $('#undesignateButton')[0].disabled = false;
      return true;
    }
  })
});
