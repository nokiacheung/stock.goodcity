import Ember from "ember";
import config from '../../config/environment';

export default Ember.Controller.extend({

  backLinkPath: "",
  displayAllItems: false,
  displayItemOptions: true,
  isMobileApp: config.cordova.enabled,

  itemsList: Ember.computed('model.items', 'displayAllItems', function() {
    return this.get("displayAllItems") ? this.get("model.items") : this.get("model.items").slice(0, 3);
  }),

  actions: {
    displayAllItems() {
      this.set("displayAllItems", true);
    }
  }

});
