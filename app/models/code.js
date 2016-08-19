import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({

  name:             attr('string'),
  visibleInSelects: attr('boolean', { defaultValue: false }),
  location:         belongsTo('location', { async: false }),
});
