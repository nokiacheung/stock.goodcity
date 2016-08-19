import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';

export default Ember.Controller.extend({
  queryParams: ['codeId', 'locationId'],
  codeId: "",
  locationId: "",
  inventoryNumber: "",

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
      new AjaxPromise(`/inventory_numbers/${this.get('inventoryNumber')}`, "DELETE", this.get('session.authToken'));
      this.set("locationId", "");
      this.set("codeId", "");
      this.transitionToRoute("index");
    }
  }

});
