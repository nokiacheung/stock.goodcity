import Ember from 'ember';
const { getOwner } = Ember;

export default Ember.Route.extend({

  beforeModel() {
    if (this.session.get('isLoggedIn') && this.get('session.currentUser')) {
      this.transitionTo('/');
    } else if(this.session.get('isLoggedIn')){
      getOwner(this).lookup("route:application")._loadDataStore();
    } else {
      this.transitionTo('login');
    }
  }
});
