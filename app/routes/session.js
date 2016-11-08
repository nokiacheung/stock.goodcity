import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel() {
    if (this.session.get('isLoggedIn')) {
      if(this.get('session.currentUser')) {
        this.transitionTo('/');
      }
    } else {
      this.transitionTo('login');
    }
  }
});
