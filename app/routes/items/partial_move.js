import AuthorizeRoute from './../authorize';
import Ember from 'ember';

export default AuthorizeRoute.extend({
  messageBox: Ember.inject.service(),

  beforeModel(transition) {
    this.get("messageBox").alert('This feature is currently disabled.', () => {
      transition.abort();
      this.transitionTo('items.index');
    });
  },

  model(params){
    return this.store.peekRecord("item", params.item_id) || this.store.findRecord('item', params.item_id);
  },
  setupController(controller, model){
    this._super(controller, model);
    controller.set('isEditing', false);
  }
});
