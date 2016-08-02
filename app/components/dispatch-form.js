import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Component.extend({
  displayUserPrompt: false,
  store: Ember.inject.service(),
  messageBox: Ember.inject.service(),
  i18n: Ember.inject.service(),
  hideDetailsLink: true,

  actions: {
    displayDispatchOverlay() {
      this.set("displayUserPrompt", true);
    },

    dispatchItem() {
      var item = this.get("item");
      var url = `/items/${item.get('id')}/dispatch_stockit_item`;
      var loadingView = getOwner(this).lookup('component:loading').append();

      new AjaxPromise(url, "PUT", this.get('session.authToken'))
        .then(data => {
          this.get("store").pushPayload(data);
        })
        .finally(() => {
          loadingView.destroy();
          this.sendAction("closeList");
          if (this.get("order.allItemsDispatched")) {
            this.get('messageBox').alert(this.get("i18n").t("dispatch.all_items_dispatched"));
          }
        });

    },

    undispatchItem() {
      var item = this.get("item");
      var url = `/items/${item.get('id')}/undispatch_stockit_item`;
      this.send("resqustAPI", url);
    },

    resqustAPI(url) {
      var loadingView = getOwner(this).lookup('component:loading').append();

      new AjaxPromise(url, "PUT", this.get('session.authToken'))
        .then(data => {
          this.get("store").pushPayload(data);
        })
        .finally(() => {
          loadingView.destroy();
          this.sendAction("closeList");
        });
    },

    closeItemOptions() {
      this.sendAction("closeList");
    }
  }

});
