import DS from 'ember-data';
import Ember from 'ember';

var attr = DS.attr;

export default DS.Model.extend({

  firstName:         attr('string'),
  lastName:          attr('string'),
  phoneNumber:       attr('string'),
  mobilePhoneNumber: attr('string'),

  displayNumber: Ember.computed.or("mobilePhoneNumber", "phoneNumber"),

  fullName: Ember.computed("firstName", "lastName", function() {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  }),

});
