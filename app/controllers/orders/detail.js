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
  i18n: Ember.inject.service(),
  isOrderProcessRestarted: false,

  displayOrderOptions: Ember.computed({
    get: function() {
      return false;
    },
    set: function(key, value) {
      return value;
    }
  }),

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
    toggleOrderOptions() {
      this.toggleProperty("displayOrderOptions");
    },

    dispatchOrdersPackagePopUp() {
      alert("clicked");
    },

    displayAllItems() {
      this.set("displayAllItems", true);
    },

    updateOrder(order, actionName) {
      switch(actionName) {
        case "messagePopUp":
          this.send("changeOrderState", order, "cancel");
          break;
        case "start_processing":
          this.send("changeOrderState", order, actionName);
          break;
        case "resubmit":
          this.send("promptResubmitModel", order ,actionName);
          break;
        case "reopen":
          this.send("promptReopenModel", order, actionName);
          break;
        case "restart_process":
          this.send("promptRestartProcessModel", order, actionName);
          break;
        case "dispatch_later":
          this.send("dispatchLaterModel", order, actionName);
          break;
        case "cancel":
          this.send("promptCancelOrderModel", order, actionName);
          break;
        case "close":
          this.send("promptCloseOrderModel", order, actionName);
          break;
        default:
          this.send("changeOrderState", order, actionName);
      }
    },

    dispatchLaterModel(order, actionName) {
      var _this = this;
      if(!order.get('allDesignatedOrdersPackages')) {
        this.get("messageBox").alert(_this.get("i18n").t("order_details.dispatch_later_undispatch_warning"));
        this.send("toggleDisplayOptions");
      } else {
        this.get("messageBox").custom(
          _this.get("i18n").t("order_details.dispatch_later_warning"),
          _this.get("i18n").t("order.dispatch_later"),
          () => { this.send("changeOrderState", order, actionName); },
          _this.get("i18n").t("not_now"),
          () => { this.send("toggleDisplayOptions"); });
      }
    },

    promptResubmitModel(order, actionName) {
      var _this = this;
      this.get("messageBox").custom(
        _this.get("i18n").t("order_details.resubmit_order_warning"),
        _this.get("i18n").t("order.resubmit"),
        () => { this.send("changeOrderState", order, actionName); },
        _this.get("i18n").t("not_now"),
        () => { this.send("toggleDisplayOptions"); }
        );
    },

    promptReopenModel(order, actionName) {
      var _this = this;
      this.get("messageBox").custom(
        _this.get("i18n").t("order_details.reopen_warning"),
        _this.get("i18n").t("order.reopen_order"),
        () => { this.send("changeOrderState", order, actionName); },
        _this.get("i18n").t("not_now"),
        () => { this.send("toggleDisplayOptions"); });
    },

    toggleDisplayOptions() {
      if(this.get("displayOrderOptions")) {
        this.set("displayOrderOptions", false);
      }
    },

    promptRestartProcessModel(order, actionName) {
      var _this = this;
      if(!order.get('allDesignatedOrdersPackages')) {
        this.get("messageBox").alert(_this.get("i18n").t("order_details.restart_undispatch_warning"));
        this.send("toggleDisplayOptions");
      } else {
        this.get("messageBox").custom(_this.get("i18n").t("order_details.restart_warning"),
          _this.get("i18n").t("order.restart_process"),
          () => {
            this.set("isOrderProcessRestarted", true);
            this.send('changeOrderState', order, actionName);
          },
          _this.get("i18n").t("not_now"),
          () => { this.send("toggleDisplayOptions"); });
      }
    },

    promptCancelOrderModel(order, actionName) {
      var _this = this;
      this.get("messageBox").custom(
        _this.get("i18n").t("order_details.cancel_warning"),
        _this.get("i18n").t("order.cancel_order"),
        () => { this.send("changeOrderState", order, actionName); },
        _this.get("i18n").t("not_now"),
        () => { this.send("toggleDisplayOptions"); });
    },

    promptCloseOrderModel(order, actionName) {
      var _this = this;
      this.get("messageBox").custom(
        _this.get("i18n").t("order_details.close_warning") ,
        _this.get("i18n").t("order.close_order"),
        () => { this.send("changeOrderState", order, actionName); },
        _this.get("i18n").t("not_now"),
        () => { this.send("toggleDisplayOptions"); });
    },

    changeOrderState(order, transition) {
      var url = `/orders/${order.id}/transition`;
      var loadingView = getOwner(this).lookup('component:loading').append();
      new AjaxPromise(url, "PUT", this.get('session.authToken'), { transition: transition })
        .then(data => {
          if("transition" === "restart_process") {
            this.set("isOrderProcessRestarted", false);
          }
          this.send("toggleDisplayOptions");
          data["designation"] = data["order"];
          this.get("store").pushPayload(data);
        })
        .finally(() => loadingView.destroy());
    }
  }

});
