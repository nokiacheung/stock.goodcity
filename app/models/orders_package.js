import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  packageId: attr('number'),
  order_id: attr('number'),
  itemId: attr('number'),
  designationId: attr('number'),
  quantity: attr('number'),
  sentOn: attr('date'),
  state: attr('string'),

  item:    belongsTo('item', { async: false }),
  designation:    belongsTo('designation', { async: false }),
});
