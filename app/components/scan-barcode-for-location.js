import Ember from "ember";
import config from '../config/environment';

export default Ember.Component.extend({

  messageBox: Ember.inject.service(),
  isMobileApp: config.cordova.enabled,

  actions: {
    scanBarcodeForLocation(route) {
      var onSuccess = res => {
        if (!res.cancelled) {
          var queryParams = {queryParams: { searchInput: res.text } };
          this.get('router').transitionTo(route, queryParams);
        }
      };
      var onError = error => this.get("messageBox").alert("Scanning failed: " + error);
      var options = {"formats": "CODE_128"};

      window.cordova.plugins.barcodeScanner.scan(onSuccess, onError, options);
    },
  }

});
