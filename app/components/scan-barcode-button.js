import Ember from "ember";
import config from '../config/environment';

export default Ember.Component.extend({

  messageBox: Ember.inject.service(),
  order: null,

  actions: {

    scanBarcode(route) {

      var onSuccess = res => {
        if (!res.cancelled) {
          this.get('router').transitionTo(route, this.get("order"), {queryParams: { searchText: res.text } });
        }
      };
      var onError = error => this.get("messageBox").alert("Scanning failed: " + error);
      var options = {"formats": "CODE_128"};

      window.cordova.plugins.barcodeScanner.scan(onSuccess, onError, options);

    },
  }

});
