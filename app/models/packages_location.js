import Ember from "ember";
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  package_id: attr('number'),
  item_id: attr('number'),
  quantity: attr('number'),
  location_id: attr('number'),
  is_first_created: attr('boolean'),

  location:  belongsTo('location', { async: false }),
  item:  belongsTo('item', { async: false }),

  quantityToMove: Ember.computed('quantity', function(){
    return this.get('quantity');
  }),

  packageInventoryNumber: Ember.computed('item_id', function(){
    return this.get('item.inventoryNumber');
  }),

  updateQuantity: Ember.observer('quantity', function(){
    var packages_location_id = this.get('id');
    var packages_location_text_field = Ember.$(`#${packages_location_id}`)[0];
    if(packages_location_text_field){
      packages_location_text_field.value = this.get('quantity');
    }
  }),
});

