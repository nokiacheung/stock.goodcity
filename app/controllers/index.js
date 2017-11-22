import { computed } from '@ember/object';
import Controller from '@ember/controller';
import config from '../config/environment';

export default Controller.extend({
  stockAppVersion: computed(function(){
    return config.cordova.enabled ? config.APP.VERSION : null;
  })
});
