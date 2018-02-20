import Ember from "ember";

export default Ember.Controller.extend({
  gcOrganisationUsers: null,
  filteredResults: Ember.computed.alias('model.designations')
});
