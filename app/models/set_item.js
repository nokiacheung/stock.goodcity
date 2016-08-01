import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import Model from 'ember-data/model';

export default Model.extend({

  description: attr('string'),
  code:        belongsTo('code', { async: false }),
  items:       hasMany('item', { async: false }),

});
