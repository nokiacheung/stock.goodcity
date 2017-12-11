import config from '../../config/environment';
import Ember from "ember";
import searchModule from "../search_module";

export default Ember.Controller.extend({
  allOrganisationsUsers: Ember.computed(function(){
    return this.store.peekAll("OrganisationsUser");
  }),
});
