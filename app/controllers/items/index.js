import config from '../../config/environment';
import Ember from "ember";
import searchModule from "../search_module";

export default searchModule.extend({

  queryParams: ['searchInput', "itemSetId"],
  searchInput: "",
  itemSetId: null,

  isMobileApp: config.cordova.enabled,
  displayItemOptions: false,
  displayItemOptionsList: true,
  searchModelName: "item",
  minSearchTextLength: 2,

  getCurrentUser: Ember.computed(function(){
    var store = this.get('store');
    var currentUser = store.peekAll('user_profile').get('firstObject') || null;
    if(currentUser) {
      return currentUser.get("isSupervisor");
    }
    return currentUser;
  }).volatile(),

  onItemSetIdChange: Ember.observer("itemSetId", function() {
    // wait before applying the filter
    if (this.get("itemSetId")) {
      Ember.run.debounce(this, this.applyFilter, 0);
    }
  })
});
