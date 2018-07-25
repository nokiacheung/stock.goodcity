import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({

  firstName:         attr('string'),
  lastName:          attr('string'),
  phoneNumber:       attr('string'),
  mobilePhoneNumber: attr('string'),
  name:              attr('string'),
  displayNumber: Ember.computed.or("mobilePhoneNumber", "phoneNumber"),

  fullName: Ember.computed("firstName", "lastName", function() {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  })

});
