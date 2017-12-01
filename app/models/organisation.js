import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  name: attr('string'),
  name_en: attr('string'),
  website: attr('string'),
  registration: attr('string')
});
