import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),

  getCurrentUser: Ember.computed(function(){
    var store = this.get('store');
    var currentUser = store.peekAll('user_profile').get('firstObject') || null;
    if(currentUser) {
      return currentUser.get("isSupervisor");
    }
    return currentUser;
  }).volatile(),

  stockAppVersion: Ember.computed(function(){
    return config.cordova.enabled ? config.APP.VERSION : null;
  })
});
