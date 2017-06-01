import Ember from 'ember';

export default Ember.Controller.extend({

  subscription: Ember.inject.controller(),

  initSubscription: Ember.on('init', function() {
    this.get('subscription').send('wire');
  }),
});
