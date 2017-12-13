import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  name: attr('string'),
  nameEn: attr('string'),
  website: attr('string'),
  registration: attr('string'),

  organisationsUsers: hasMany('organisations_user', { async: false }),
  orders: hasMany('order', { async: false }),

});
