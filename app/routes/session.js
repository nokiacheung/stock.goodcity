import Route from '@ember/routing/route';

export default Route.extend({

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
