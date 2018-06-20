import Ember from "ember";

export default Ember.Controller.extend({
  contact: Ember.computed.alias("model.contact")
});
