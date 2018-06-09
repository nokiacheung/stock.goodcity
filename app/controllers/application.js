import Ember from 'ember';

export default Ember.Controller.extend({

  subscription: Ember.inject.controller(),
  store: Ember.inject.service(),

  initSubscription: Ember.on('init', function() {
    this.get('subscription').send('wire');
  }),

  actions: {
    logMeOut() {
      this.session.clear(); // this should be first since it updates isLoggedIn status
      this.get('subscriptions').send('unwire');
      this.get('subscriptions').send('unloadNotifications');
      this.get('store').unloadAll();
      this.transitionToRoute('login');
    }
  }
});
