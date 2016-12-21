import AuthorizeRoute from './../authorize';
import Ember from 'ember';

export default AuthorizeRoute.extend({

  queryParams: {
    itemSetId: "",
    searchInput: ""
  },

  partial_qnty: Ember.computed.localStorage(),

  afterModel() {
    this.set('partial_qnty', 0);
  },

  setupController(controller, model){
    this.set('partial_qnty', 0);
    this._super(controller, model);
    controller.set('itemSetId', this.paramsFor('items.index').itemSetId);
  }

});
