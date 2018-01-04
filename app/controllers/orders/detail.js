import Ember from "ember";
import config from '../../config/environment';

export default Ember.Controller.extend({

  backLinkPath: "",
  displayAllItems: false,
  displayItemOptions: true,
  isMobileApp: config.cordova.enabled,
  itemIdforHistoryRoute: null,
  organisationIdforHistoryRoute: null,

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
    }
  }

});
