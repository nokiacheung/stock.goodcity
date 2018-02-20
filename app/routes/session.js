import Ember from 'ember';
const { getOwner } = Ember;

export default Ember.Route.extend({
  loadOrRedirectUser() {
    if(!this.get('session.currentUser')){
      getOwner(this).lookup("route:application")._loadDataStore();
    } else{
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
