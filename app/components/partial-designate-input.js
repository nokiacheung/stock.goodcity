import $ from 'jquery';
import { computed, observer } from '@ember/object';
import { alias } from '@ember/object/computed';
import TextField from '@ember/component/text-field';
import config from '../config/environment';

export default TextField.extend({
  item: null,
  value: "",
  tagName: "input",
  maxlength: "5",
  env: config.APP.environment,
  attributeBindings: [ "name", "id", "value", 'placeholder'],
  partial_qty_value: alias('value'),
  designateFullSet: computed.localStorage(),

  minSetQty: computed('item.setItem.items', function() {
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
    if(this.get("env") === "test") {
      return false;
    }
    $(this.element).css("background-color", "#002352");
    this.set('value', this.get('minSetQty') || this.get('item.quantity'));
  },

  click() {
    if(this.get("env") === "test") {
      return false;
    }
    $(this.element).css("background-color", "#002352");
  },

  focusOut() {
    if(this.get("env") === "test") {
      return false;
    }
    var regex = /^\d+$/;
    var input_value = this.get('value');
    if(input_value <= 0 || (this.get('item.isSet') && input_value > this.get('minSetQty')) || input_value > this.get('item.quantity') || !(regex.test(input_value))) {
      $(this.element).css("border", "1px solid #fddbdc");
      $('#partial_designate')[0].disabled = true;
      this.$().focus();
      return false;
    }
  },

  focusTrigger: observer('value', function() {
    if(this.get("env") === "test") {
      return false;
    }
    var regex = /^\d+$/;
    var input_value = this.get('value');
    if(input_value <= 0 || (this.get('item.isSet') && input_value > this.get('minSetQty')) || input_value > this.get('item.quantity') || !(regex.test(input_value))) {
      $(this.element).css("border", "1px solid #fddbdc");
      $('#partial_designate')[0].disabled = true;
      this.$().focus();
      return false;
    } else {
      $(this.element).css("border", "1px solid #8091a9");
      $('#partial_designate')[0].disabled = false;
      return true;
    }
  })
});
