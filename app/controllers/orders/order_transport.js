import Ember from "ember";

export default Ember.Controller.extend({
  order_transport: Ember.computed.alias("model.order_transport"),
});
