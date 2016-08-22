import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';

export default Ember.Controller.extend({
  queryParams: ['codeId', 'locationId'],
  codeId: "",
  locationId: "",
  inventoryNumber: "",
  displayInventoryOptions: false,
  autoGenerateInventory: true,
  inputInventory: false,

  code: Ember.computed("codeId", function() {
    return this.get("store").peekRecord("code", this.get("codeId"));
  }),

  location: Ember.computed("codeId", "locationId", function() {
    var locationId = this.get("locationId");
    var location = this.get("store").peekRecord("location", locationId) || this.get("code.location");
    if(!locationId && location) { this.set("locationId", location.get("id")); }
    return location;
  }),

  actions: {
    cancelForm() {
      if(this.get("autoGenerateInventory")) {
        new AjaxPromise(`/inventory_numbers/${this.get('inventoryNumber')}`, "DELETE", this.get('session.authToken'));
      }
      this.set("locationId", "");
      this.set("codeId", "");
      this.transitionToRoute("index");
    },

    toggleInventoryOptions() {
      this.toggleProperty("displayInventoryOptions");
    },

    editInventoryNumber() {
      new AjaxPromise(`/inventory_numbers/${this.get('inventoryNumber')}`, "DELETE", this.get('session.authToken'));
      this.set("inventoryNumber", "");
      this.set("inputInventory", true);
      this.set("autoGenerateInventory", false);
      this.set("displayInventoryOptions", false);
    },

    autoGenerateInventoryNumber() {
      var _this = this;
      this.set("inventoryNumber", "");
      this.set("inputInventory", false);
      this.set("autoGenerateInventory", true);
      this.set("displayInventoryOptions", false);

      new AjaxPromise("/inventory_numbers", "POST", this.get('session.authToken'))
      .then(function(data) {
        _this.set("inventoryNumber", data.inventory_number);
      });
    }
  }

});
