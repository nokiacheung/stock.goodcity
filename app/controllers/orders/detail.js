import Ember from "ember";
import config from '../../config/environment';
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Controller.extend({

  backLinkPath: "",
  displayAllItems: false,
  displayItemOptions: true,
  isMobileApp: config.cordova.enabled,
  itemIdforHistoryRoute: null,
  organisationIdforHistoryRoute: null,
  store: Ember.inject.service(),
  messageBox: Ember.inject.service(),

  ordersPackagesLengthMoreThenThree: Ember.observer('model.ordersPackages', function() {
    var ordersPackages = this.get("model.ordersPackages");
    ordersPackages.canonicalState.forEach(record => {
      if(record && record._data.state === "cancelled") {
          ordersPackages.canonicalState.removeObject(record);
      }
    });
    return (ordersPackages.canonicalState.length) >= 3 ? this.set("displayAllItems", false) : this.set("displayAllItems", true);
  }),

  itemsList: Ember.computed('model.items', 'displayAllItems', 'model.ordersPackages', 'model.ordersPackages.@each.quantity', function() {
    var ordersPackages = this.get("model.ordersPackages").filterBy("quantity");
    return this.get("displayAllItems") ? ordersPackages : ordersPackages.slice(0, 3);
  }),

  actions: {
    displayAllItems() {
      this.set("displayAllItems", true);
    },

    startProcessing(order) {
      this.send("changeOrderState", `/orders/${order.id}/start_process`);
    },

    finishProcessing(order) {
      this.send("changeOrderState", `/orders/${order.id}/finish_process`);
    },

    promptCancelOrderModel(order) {
      this.get("messageBox").custom(
        "This will remove all items from the order and cancel the order.",
        "Cancel Order",
        () => { this.send("cancelOrder", order); },
        "Not Now");
    },

    promptCloseOrderModel(order) {
      this.get("messageBox").custom(
        "You will not be able to modify the order after closing it.",
        "Close Order",
        () => { this.send("closeOrder", order); },
        "Not Now");
    },

    cancelOrder(order) {
      this.send("changeOrderState", `/orders/${order.id}/cancel_order`);
    },

    closeOrder(order) {
      this.send("changeOrderState", `/orders/${order.id}/close_order`);
    },

    changeOrderState(url) {
      var loadingView = getOwner(this).lookup('component:loading').append();
      new AjaxPromise(url, "PUT", this.get('session.authToken'))
        .then(data => {
          data["designation"] = data["order"];
          this.get("store").pushPayload(data);
        })
        .finally(() => loadingView.destroy());
    }
  }

});
