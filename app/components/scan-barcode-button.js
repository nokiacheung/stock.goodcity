import Ember from "ember";
import config from '../config/environment';

export default Ember.Component.extend({

  messageBox: Ember.inject.service(),
  order: null,
  item: null,

  actions: {

    scanBarcode(route) {

      var onSuccess = res => {
        if (!res.cancelled) {
          if (route === "order.items") {
            this.get('router').transitionTo(route, this.get("order"), {queryParams: { searchText: res.text } });
          }
          else if (route === "items.index") {
            this.get('router').transitionTo(route, this.get("item"), {queryParams: { searchText: res.text } });
          }
        }
      };
      var onError = error => this.get("messageBox").alert("Scanning failed: " + error);
      var options = {"formats": "CODE_128"};

      window.cordova.plugins.barcodeScanner.scan(onSuccess, onError, options);

    },
  }

});
