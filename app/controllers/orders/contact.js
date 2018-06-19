import Ember from "ember";

export default Ember.Controller.extend({
  contact: Ember.computed.alias("model.contact"),

  gcContact: Ember.computed('model', function() {
    return this.get("model.gcOrganisationUser");
  })
});
