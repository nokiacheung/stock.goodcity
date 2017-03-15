import Ember from "ember";
import config from '../config/environment';

export default Ember.TextField.extend({
  item: null,
  value: "",
  env: config.APP.environment,
  tagName: "input",
  maxlength: "5",
  attributeBindings: [ "name", "id", "value", 'placeholder'],

  click() {
    if(this.get("env") === "test") {
      return false;
    }
    this.set('qtyError', false);
    Ember.$(this.element).addClass('change-color');
  },

  didInsertElement(){
    if(this.get("env") === "test") {
      return false;
    }
    Ember.$(this.element).addClass('change-color');
    var total = parseInt(Ember.$('.total-move').text()) + 1;
    var newQty = this.get('item.quantity') - 1;
    var packagesLocationQtyId = '#packages-qty-location-' + this.get('item.id');
    Ember.$(packagesLocationQtyId).text(newQty);
    Ember.$('.total-move').text(total);

    return this.set('value', 1);
  },

  focusTrigger: Ember.observer('value', function() {
    if(this.get("env") === "test") {
      return false;
    }
    var regex = /^\d+$/;
    var input_value = this.get('value');
    if(input_value < 0 || input_value > this.get('item.quantity') || !(input_value.trim()) || !(regex.test(input_value))) {
      Ember.$(this.element).css("border", "1px solid #f34d4f");
      Ember.$('#partial_move')[0].disabled = true;
      this.$().focus();
      return false;
    } else {
      Ember.$(this.element).css("border", "1px solid #8091a9");
      Ember.$('#partial_move')[0].disabled = false;
      return true;
    }
  }),

  valueChanged: Ember.observer('value', function(){
    var total = 0;
    var regex = /^\d+$/;
    var itemQuantity = this.get('item.quantity');
    var newQty = 0;
    var packagesLocationQtyId = '#packages-qty-location-' + this.get('item.id');
    if(regex.test(this.get('value')) && (!(this.get('value') > itemQuantity))){
      newQty = this.get('item.quantity') - this.get('value');
      Ember.$(packagesLocationQtyId).text(newQty);
    }
    else{
      newQty = this.get('item.quantity');
      Ember.$(packagesLocationQtyId).text(newQty);
    }
    Ember.$('.location_block input').map(function(){
      if(regex.test(this.value) && (!(this.value > itemQuantity))){
        total += parseInt(this.value);
      }
    });
    Ember.$('.total-move').text(total);
    console.log(total);
  }),
});
