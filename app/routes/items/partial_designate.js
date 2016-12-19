import Ember from 'ember';
import AuthorizeRoute from './../authorize';
const { getOwner } = Ember;

export default AuthorizeRoute.extend({

  beforeModel() {
    this._super(...arguments);
    this.store.unloadAll('ordersPackage');
  },

  model(params) {
    getOwner(this).lookup('controller:items.search_order').set('notPartialRoute', false);
    return this.store.findRecord('item', params.item_id);
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('item', model);
  }
});