import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({

  messageBox: service(),
  record: null,

  actions: {

    scanBarcode(route) {

      var onSuccess = res => {
        if (!res.cancelled) {

          var queryParams = {queryParams: { searchInput: res.text.replace(/^\x|X/,'') } };
          var record = this.get("record");

          if (record) {
            this.get('router').transitionTo(route, record, queryParams);
          } else {
            this.get('router').transitionTo(route, queryParams);
          }
        }
      };
      var onError = error => this.get("messageBox").alert("Scanning failed: " + error);
      var options = {"formats": "CODE_128"};

      window.cordova.plugins.barcodeScanner.scan(onSuccess, onError, options);

    }
  }

});
