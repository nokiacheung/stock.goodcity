import Ember from "ember";

export default Ember.Controller.extend({
  queryParams: ['codeId', 'locationId'],
  codeId: "",
  locationId: "",

  code: Ember.computed("codeId", function() {
    return this.get("store").peekRecord("code", this.get("codeId"));
  }),

  location: Ember.computed("codeId", "locationId", function() {
    return this.get("store").peekRecord("location", this.get("locationId")) || this.get("code.location");
  }),

  actions: {
    cancelForm() {
      this.set("locationId", "");
      this.set("codeId", "");
      this.transitionToRoute("index");
    }
  }

});
