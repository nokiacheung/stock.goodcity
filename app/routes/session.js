import Ember from 'ember';
const { getOwner } = Ember;

export default Ember.Route.extend({
  cordova: Ember.inject.service(),

  loadOrRedirectUser() {
    if(!this.get('session.currentUser')){
      getOwner(this).lookup("route:application")._loadDataStore();
    } else{
      if (this.session.get('isLoggedIn')) {
        this.get("cordova").appLoad();
      }
      this.transitionTo('/');
    }
  },

  beforeModel() {
    if (window.localStorage.getItem("authToken") && this.session.get('isLoggedIn')) {
      this.loadOrRedirectUser();
    } else {
      this.transitionTo('login');
    }
  }
});
