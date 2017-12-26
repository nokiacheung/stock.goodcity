import Ember from "ember";
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

  ordersCount: Ember.computed('orders.[]', function(){
    return this.get('orders.length');
  }),

  usersCount: Ember.computed('organisationsUsers.[]', function(){
    return this.get('organisationsUsers.length');
  })
});
