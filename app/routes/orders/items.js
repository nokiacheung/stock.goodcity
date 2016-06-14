import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({

  queryParams: {
    searchText: ""
  },

  model(params) {
    return this.store.findRecord("designation", params.order_id);
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('searchText', this.paramsFor('orders.items').searchText || "");
  }
});
