import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Component.extend({
  item: null,
  messageBox: Ember.inject.service(),

  actions: {

    printBarcode() {
      var loadingView = getOwner(this).lookup('component:loading').append();
      new AjaxPromise(`/packages/${this.get('item.id')}/print_inventory_label`, "GET", this.get('session.authToken'))
        .catch(xhr => {
          if (xhr.status !== 200) {
            var errors = xhr.responseText;
            try { errors = Ember.$.parseJSON(xhr.responseText).errors; }
            catch(err) {}
            this.get("messageBox").alert(errors);
          } else {
            throw xhr;
          }
        })
        .finally(() => {
          loadingView.destroy();
          var element = Ember.$(`#printer_message_${this.get('item.id')}`).clone();
          element.prependTo(".printer_message_block");
          this.sendAction("closeList");
          Ember.run.debounce(this, this.hidePrinterMessage, 500);
        });
    }

  },

  hidePrinterMessage() {
    Ember.$(".printer_message_block").fadeOut(3000);
    Ember.run.debounce(this, this.removePrinterMessage, 2500);
  },

  removePrinterMessage() {
    Ember.$(".printer_message_block").empty();
    Ember.$(".printer_message_block").addClass("visible");
  }

});
