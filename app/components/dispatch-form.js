import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Component.extend({
  displayUserPrompt: false,
  store: Ember.inject.service(),
  messageBox: Ember.inject.service(),
  i18n: Ember.inject.service(),
  hideDetailsLink: true,

  removeItemFromSet: false,
  displayError: false,

  updateDisplayError: Ember.observer("removeItemFromSet", function() {
    this.set("displayError", !this.get("removeItemFromSet"));
  }),

  actions: {
    displayDispatchOverlay() {
      this.set("removeItemFromSet", false);
      this.set("displayError", false);
      this.set("displayUserPrompt", true);
    },

    dispatchItem() {
      var order = this.get("order");
      var item = this.get("item");
      var pkg = item.get("ordersPackages").filterBy("designationId", parseInt(order.get("id")));

      if(this.get("item.isSet") && !this.get("removeItemFromSet")) {
        this.set("displayError", true);
        return false;
      }

      var  properties = {
        order_id: order.get("id"),
        package_id: item.get('id'),
        order_package_id: pkg[0].get('id'),
      };

      var url = `/items/${item.get('id')}/dispatch_stockit_item`;
      var loadingView = getOwner(this).lookup('component:loading').append();

      new AjaxPromise(url, "PUT", this.get('session.authToken'), { package: properties })
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
