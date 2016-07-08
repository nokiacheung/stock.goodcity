import getOrderRoute from './get_order';

export default getOrderRoute.extend({

  queryParams: {
    searchText: ""
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('searchText', this.paramsFor('orders.items').searchText || "");
  }
});
