import { observer } from '@ember/object';
import $ from 'jquery';
import TextField from '@ember/component/text-field';
import config from '../config/environment';

export default TextField.extend({
  item: null,
  value: "",
  total: 0,
  recordToSkipId: null,
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
    var siblingPackagesLocations = this.get('item.siblingPackagesLocations');
    var isInvalid = false;

    siblingPackagesLocations.forEach(sibling => {
      if($(`#${sibling.id}`).length){
        if($(`#${sibling.id}`)[0].value > sibling.get('quantity')){
          isInvalid = true;
        }
      }
    });

    if(input_value < 0 || input_value > this.get('item.quantity') || !(input_value.trim()) || !(regex.test(input_value))) {
      $(this.element).closest('div').addClass("has-error");
      $('#partial_move')[0].disabled = true;
      this.$().focus();
      return false;
    } else if(this.get('total') === 0) {
      $('.location_block input').closest('div').addClass('has-error');
      $('#partial_move')[0].disabled = true;
    } else if(isInvalid) {
      $('#partial_move')[0].disabled = true;
    } else {
      $(this.element).closest('div').removeClass("has-error");
      $('#partial_move')[0].disabled = false;
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
    var recordToSkipId;
    if(!(isValGreater) && regex.test(this.get('value'))){
      newQty = this.get('item.quantity') - this.get('value');
      $(packagesLocationQtyId).text(newQty);
    } else {
      newQty = this.get('item.quantity');
      recordToSkipId = this.id;
      $(packagesLocationQtyId).text(newQty);
    }
    $('.location_block input').map(function(){
      if(regex.test(this.value)){
        if(this.id !== recordToSkipId){
          total += parseInt(this.value, 10);
        } else {
          $('#partial_move')[0].disabled = true;
        }
      }
    });
    this.set('total', total);
    $('.total-move').text(this.get('total'));
  })
});
