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
      if(routeName.indexOf("orders")) {
        path = routeName === "items.search_order" ? "items" : routeName;
      } else if(routeName === path) {
        path = path;
      } else if(routeName.indexOf("orders") === 0) {
        path = this.get("orderBackLinkPath") || path;
      }
    }

    this.set("orderBackLinkPath", path);
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('displayAllItems', model.get('items.length') <= 3);
    controller.set('backLinkPath', this.get('orderBackLinkPath'));
  }
});
