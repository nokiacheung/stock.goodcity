import barcodeScaner from './barcode-scanner';

export default barcodeScaner.extend({

  actions: {
    scanBarcode(){
      var item = this.get('item');
      var onSuccess = res => {
        if (!res.cancelled) {
          item.set('caseNumber', res.text);
        }
      };

      var onError = error => this.get("messageBox").alert("Scanning failed: " + error);
      var options = {"formats": "QR_CODE, CODE_128"};

      window.cordova.plugins.barcodeScanner.scan(onSuccess, onError, options);
    }
  }
});
