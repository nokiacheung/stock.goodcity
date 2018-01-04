import Ember from 'ember';

export default Ember.Component.extend({

  click() {
    var itemOptionsLink = Ember.$('.options-link-open.hidden');
    if(itemOptionsLink.length) {
      Ember.$('.receive-item-options').not('.hidden').toggleClass('hidden');
      Ember.$('.options-link-open.hidden').toggleClass('hidden');
      return false;
    } else {
      return true;
    }
  }
});

