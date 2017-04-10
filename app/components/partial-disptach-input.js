import Ember from "ember";
import config from '../config/environment';

export default Ember.TextField.extend({
  item: null,
  ordersPackage: null,
  total: 0,
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
      Ember.$(this.element).closest('div').addClass("has-error");
      Ember.$('#partial_move').addClass('disabled');
      this.$().focus();
      return false;
    } else if(this.get('total') > this.get('ordersPackage.quantity') || this.get('total') < this.get('ordersPackage.quantity') ){
      Ember.$('#partial_move').addClass('disabled');
    }else {
      Ember.$(this.element).closest('div').removeClass("has-error");
      Ember.$('#partial_move').removeClass('disabled');
      Ember.$('.move-qty').removeClass('has-error');
      return true;
    }
  }),

  valueChanged: Ember.observer('value', function(){
    var total = 0;
    var regex = /^\d+$/;
    var itemQuantity = this.get('item.quantity');

    var newQty = 0;
    var packagesLocationQtyId = '#packages-qty-location-' + this.get('item.id');
    var isValGreater = this.get('value') > itemQuantity;
    if(!(isValGreater) && regex.test(this.get('value'))){
      newQty = this.get('item.quantity') - this.get('value');
      Ember.$(packagesLocationQtyId).text(newQty);
    }
    else{
      newQty = this.get('item.quantity');
      Ember.$(packagesLocationQtyId).text(newQty);
    }
    Ember.$('.location_block input').map(function(){
      if(regex.test(this.value) && (!(isValGreater))){
        total += parseInt(this.value);
      }
    });

    this.set('total', total);
    Ember.$('.total-move').text(total);
  }),
});
