import Ember from "ember";

export default Ember.Controller.extend({
  item: Ember.computed.alias("model"),
  backLinkPath: "",

});
