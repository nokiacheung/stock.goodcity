import Ember from 'ember';

export default Ember.Controller.extend({

  subscription: Ember.inject.controller(),
  cordova: Ember.inject.service(),
  store: Ember.inject.service(),

  initSubscription: Ember.on('init', function() {
    this.get('subscription').send('wire');
  }),

  actions: {
    logMeOut() {
      this.session.clear(); // this should be first since it updates isLoggedIn status
      this.get('subscription').send('unwire');
      this.get('subscription').send('unloadNotifications');
      this.get('store').unloadAll();
      this.transitionToRoute('login');
    }
  }
});
