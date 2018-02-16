import searchModule from "../search_module";
import Ember from 'ember';

export default searchModule.extend({

  searchModelName: "designation",
  unloadAll: true,
  minSearchTextLength: 2,
  store: Ember.inject.service(),

  getCurrentUser: Ember.computed(function(){
    var store = this.get('store');
    var currentUser = store.peekAll('user_profile').get('firstObject') || null;
    if(currentUser) {
      return (currentUser.get("permission.name") === "Supervisor");
    }
    return currentUser;
  }).volatile()
});
