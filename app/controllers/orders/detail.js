import Ember from "ember";
import config from '../../config/environment';

export default Ember.Controller.extend({

  backLinkPath: "",
  displayAllItems: false,
  displayItemOptions: true,
  isMobileApp: config.cordova.enabled,

  itemsList: Ember.computed('model.items', 'displayAllItems', 'model.ordersPackages', function() {
    var ordersPackages = this.get("model.ordersPackages").filterBy('state', 'designated');
    return this.get("displayAllItems") ? ordersPackages : ordersPackages.slice(0, 3);
  }),

  actions: {
    displayAllItems() {
      this.set("displayAllItems", true);
    }
  }

});
