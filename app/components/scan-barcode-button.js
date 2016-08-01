import Ember from "ember";

export default Ember.Component.extend({

  messageBox: Ember.inject.service(),
  record: null,

  actions: {

    scanBarcode(route) {

      var onSuccess = res => {
        if (!res.cancelled) {

          var queryParams = {queryParams: { searchInput: res.text } };
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

    },
  }

});
