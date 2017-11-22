import Service from '@ember/service';
import config from '../config/environment';

export default Service.extend({

  isAndroid: function () {
    if (!config.cordova.enabled || !window.device) { return; }
    return ["android", "Android", "amazon-fireos"].indexOf(window.device.platform) >= 0;
  },

  isIOS: function(){
    if (!config.cordova.enabled || !window.device) { return; }
    return window.device.platform === "iOS";
  }

});
