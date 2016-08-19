import Ember from "ember";

export default Ember.Controller.extend({
  queryParams: ['codeId', 'locationId'],
  codeId: "",
  locationId: "",

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
      this.set("locationId", "");
      this.set("codeId", "");
      this.transitionToRoute("index");
    }
  }

});
