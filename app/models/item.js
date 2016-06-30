import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({

  notes:           attr('string'),
  inventoryNumber: attr('string'),
  quantity:        attr('number'),
  sentOn:          attr('date'),
  isSet:           attr('boolean'),
  itemId:          attr('number'),

  designation: belongsTo('designation', { async: false }),
  location:    belongsTo('location', { async: false }),
  image:       belongsTo('image', { async: false }),
  code:        belongsTo('code', { async: false }),

});
