import Ember from "ember";

export default Ember.Controller.extend({
  filteredResults: Ember.computed.alias('model.designations')
});
