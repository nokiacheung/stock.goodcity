import Ember from "ember";

export default Ember.Controller.extend({
  queryParams: ['codeId'],
  codeId: "",

  code: Ember.computed("codeId", function() {
    return this.get("store").peekRecord("code", this.get("codeId"));
  })
});
