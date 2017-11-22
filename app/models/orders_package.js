import { computed } from '@ember/object';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  packageId: attr('number'),
  orderId: attr('number'),
  itemId: attr('number'),
  designationId: attr('number'),
  quantity: attr('number'),
  sentOn: attr('date'),
  state: attr('string'),

  item:    belongsTo('item', { async: true }),
  designation:    belongsTo('designation', { async: true }),

  availableQty: computed("quantity", function() {
    return this.get('quantity');
  }),

  qtyToModify: computed("quantity", "item.quantity", function() {
    return this.get('quantity') + this.get("item.quantity");
  }),

  orderCode: computed("designation", function(){
    return this.get('designation.code');
  }),

  isSingleQuantity: computed('quantity', function(){
    return this.get('quantity') === 1;
  })
});
