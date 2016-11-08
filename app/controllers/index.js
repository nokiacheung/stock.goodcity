import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
  stockAppVersion: Ember.computed(function(){
    return config.cordova.enabled ? config.APP.VERSION : null;
  }),
});
