import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement() {
    Ember.$(':input:not(:button)').val([]);
  }
});

