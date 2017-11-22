import { computed } from '@ember/object';
import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({

  queryParams: {
    itemSetId: "",
    searchInput: ""
  },
  designateFullSet: computed.localStorage(),

  partial_qnty: computed.localStorage(),

  afterModel() {
    this.set('partial_qnty', 0);
    this.set('designateFullSet', false);
  },

  setupController(controller, model){
    this._super(controller, model);
    this.set('designateFullSet', false);
    this.set('partial_qnty', 0);
    this._super(controller, model);
    controller.set('itemSetId', this.paramsFor('items.index').itemSetId);
  }

});
