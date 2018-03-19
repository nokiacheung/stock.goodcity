import Ember from 'ember';
import DS from 'ember-data';
import Addressable from './addressable';

var attr = DS.attr;

export default Addressable.extend({
  firstName:   attr('string'),
  lastName:    attr('string'),
  mobile:      attr('string'),

  userRoles: DS.hasMany('userRoles', { async: false }),

  roles: Ember.computed('userRoles.[]', function(){
    var roles = [];
    this.get('userRoles').forEach(userRole => {
      roles.push(userRole.get('role'));
    });
    return roles;
  }),

  roleNames: Ember.computed('roles', function(){
    var roleNames = [];
    this.get('roles').forEach(role => {
      roleNames.push(role.get('name'));
    });
    return roleNames;
  }),

  isReviewer: Ember.computed('roleNames', function(){
    return this.get('roleNames').includes('Reviewer');
  }),

  isSupervisor: Ember.computed('roleNames', function(){
    return this.get('roleNames').includes('Supervisor');
  }),

  mobileWithCountryCode: Ember.computed('mobile', function(){
    return this.get('mobile') ? ("+852" + this.get('mobile')) : "";
  }),

  fullName: Ember.computed('firstName', 'lastName', function(){
    return (this.get('firstName') + " " + this.get('lastName'));
  })
});
