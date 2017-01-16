import getOrderRoute from './get_order';
import Ember from 'ember';

export default getOrderRoute.extend({

  orderBackLinkPath: Ember.computed.localStorage(),

  beforeModel() {
    var previousRoutes = this.router.router.currentHandlerInfos;
    var previousRoute = previousRoutes && previousRoutes.pop();
    var path = "orders.index";

    if(previousRoute) {
      var routeName = previousRoute.name;
      if(routeName === "items.history") {
        window.location.reload();
      }
      if(routeName.indexOf("orders")) {
        switch(routeName) {
          case "items.search_order": path = "items"; break;
          case "items.detail": path = path; break;
          default: path = routeName;
        }
      } else if(routeName === "orders" || routeName === path) {
        path = path;
      } else if(routeName.indexOf("orders") === 0) {
        path = this.get("orderBackLinkPath") || path;
      }
    }

    this.set("orderBackLinkPath", path);
  },

  model(params) {
    return this.store.findRecord("designation", params.order_id, { reload: true });
  },

  afterModel(model) {
    if(model) {
      var ordersPackages = this.store.query("orders_package", {   search_by_order_id: model.get("id") });
      this.store.pushPayload(ordersPackages);
    }
  },

  setupController(controller, model){
    if(model) {
      this._super(controller, model);
      controller.set('backLinkPath', this.get('orderBackLinkPath'));
    }
  }
});
