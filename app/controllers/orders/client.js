import Ember from "ember";

export default Ember.Controller.extend({
  client: Ember.computed.alias("model.localOrder")
});
