import Ember from "ember";

export default Ember.Controller.extend({
  allOrganisationsUsers: Ember.computed(function(){
    return this.store.peekAll("OrganisationsUser");
  })
});
