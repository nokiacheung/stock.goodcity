import { observer } from '@ember/object';
import $ from 'jquery';
import TextField from '@ember/component/text-field';
import config from '../config/environment';

export default TextField.extend({
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
    $(this.element).addClass('change-color');
  },

  didInsertElement(){
    if(this.get("env") === "test") {
      return false;
    }
    $(this.element).addClass('change-color');
    var total = parseInt($('.total-move').text(), 10) + 1;
    var newQty = this.get('item.quantity') - 1;
    var packagesLocationQtyId = '#packages-qty-location-' + this.get('item.id');
    $(packagesLocationQtyId).text(newQty);
    $('.total-move').text(total);

    return this.set('value', 1);
  },

  focusTrigger: observer('value', function() {
    if(this.get("env") === "test") {
      return false;
    }
    var regex = /^\d+$/;
    var input_value = this.get('value');

    if(input_value < 0 || input_value > this.get('item.quantity') || !(input_value.trim()) || !(regex.test(input_value))) {
      $(this.element).closest('div').addClass("has-error");
      $('#partial_dispatch')[0].disabled = true;
      this.$().focus();
      return false;
    } else if(this.get('total') > this.get('ordersPackage.quantity') || this.get('total') < this.get('ordersPackage.quantity') ){
      $('#partial_dispatch')[0].disabled = true;
    }else {
      $(this.element).closest('div').removeClass("has-error");
      $('#partial_dispatch')[0].disabled = false;
      $('.move-qty').removeClass('has-error');
      return true;
    }
  }),

  valueChanged: observer('value', function(){
    var total = 0;
    var regex = /^\d+$/;
    var itemQuantity = this.get('item.quantity');

    var newQty = 0;
    var packagesLocationQtyId = '#packages-qty-location-' + this.get('item.id');
    var isValGreater = this.get('value') > itemQuantity;
    if(!(isValGreater) && regex.test(this.get('value'))){
      newQty = this.get('item.quantity') - this.get('value');
      $(packagesLocationQtyId).text(newQty);
    }
    else{
      newQty = this.get('item.quantity');
      $(packagesLocationQtyId).text(newQty);
    }
    $('.location_block input').map(function(){
      if(regex.test(this.value) && (!(isValGreater))){
        total += parseInt(this.value, 10);
      }
    });

    this.set('total', total);
    $('.total-move').text(total);
  })
});
