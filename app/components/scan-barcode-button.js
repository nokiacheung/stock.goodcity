import Ember from "ember";

export default Ember.Component.extend({

  messageBox: Ember.inject.service(),
  record: null,

  actions: {

    scanBarcode(route) {

      var onSuccess = res => {
        if (!res.cancelled) {
          var strippedURL = res.text.substring(res.text.lastIndexOf('=') + 1);
          var queryParams = {queryParams: { searchInput: strippedURL.replace(/^\x|X/,'') } };
          var record = this.get("record");

          if (record) {
            this.get('router').transitionTo(route, record, queryParams);
          } else {
            this.get('router').transitionTo(route, queryParams);
          }
        }
      };
      var onError = error => this.get("messageBox").alert("Scanning failed: " + error);
      var options = {"formats": "QR_CODE, CODE_128", "orientation" : "portrait"};

      window.cordova.plugins.barcodeScanner.scan(onSuccess, onError, options);

    }
  }

});
