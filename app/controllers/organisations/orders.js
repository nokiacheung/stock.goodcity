import Ember from "ember";

export default Ember.Controller.extend({
  gcOrganisationUsersCount: null,
  filteredResults: Ember.computed.alias('model.designations')
});
