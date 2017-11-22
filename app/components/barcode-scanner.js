import { inject as service } from '@ember/service';
import Component from '@ember/component';
import config from '../config/environment';

export default Component.extend({
  messageBox: service(),
  isMobileApp: config.cordova.enabled,
  paramName: null,

  actions: {
    scanBarcode(){
      var onSuccess = res => {
        if (!res.cancelled) {
          var key = this.get("paramName") || "searchInput";
          var queryParams = {};
          queryParams[key] = res.text;
          this.get('router').transitionTo(this.get("route"), { queryParams: queryParams });
        }
      };

      var onError = error => this.get("messageBox").alert("Scanning failed: " + error);
      var options = {"formats": "CODE_128"};

      window.cordova.plugins.barcodeScanner.scan(onSuccess, onError, options);
    }
  }
});

