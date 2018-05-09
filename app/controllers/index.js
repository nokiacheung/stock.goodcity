import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),

  stockAppVersion: Ember.computed(function(){
    return config.cordova.enabled ? config.APP.VERSION : null;
  }),

  actions: {
    logMeOut() {
      this.get('application').send('logMeOut');
    }
  }
});
