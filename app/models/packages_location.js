import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  package_id: attr('number'),
  item_id: attr('number'),
  quantity: attr('number'),
  location_id: attr('number'),

  location:  belongsTo('location', { async: false }),
  item:  belongsTo('location', { async: false }),

});
