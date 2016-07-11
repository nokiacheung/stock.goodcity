import getOrderRoute from './get_order';
import Ember from 'ember';

export default getOrderRoute.extend({

  backLinkPath: Ember.computed.localStorage(),

  beforeModel() {
    var previousRoutes = this.router.router.currentHandlerInfos;
    var previousRoute = previousRoutes && previousRoutes.pop();
    var path = "orders.index";
    if(previousRoute && previousRoute.name !== "orders.items") {
      path = previousRoute.name === "items.search_order" ? "items" : previousRoute.name;
    }
    this.set("backLinkPath", path);
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('displayAllItems', model.get('items.length') <= 3);
    controller.set('backLinkPath', this.get('backLinkPath'));
  }
});
