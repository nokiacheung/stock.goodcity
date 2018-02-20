import Ember from 'ember';
const { getOwner } = Ember;

export default Ember.Route.extend({

  beforeModel() {
    if (window.localStorage.getItem("authToken") || this.session.get('isLoggedIn')) {
      if(!this.get('session.currentUser')){
        getOwner(this).lookup("route:application")._loadDataStore();
      } else{
        this.transitionTo('/');
      }
    } else {
      this.transitionTo('login');
    }
  }
});
