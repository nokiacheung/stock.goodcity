import Ember from 'ember';
import searchModule from "./search_module";

export default searchModule.extend({
  application: Ember.inject.controller(),

  getCurrentUser: Ember.computed(function(){
    var store = this.get('store');
    var currentUser = store.peekAll('user_profile').get('firstObject') || null;
    return currentUser;
  }).volatile(),

  actions: {
    logMeOut() {
      this.get('application').send('logMeOut');
    }
  }
});
