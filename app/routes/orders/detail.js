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

  setupController(controller, model){
    this._super(controller, model);
    controller.set('displayAllItems', model.get('items.length') <= 3);
    controller.set('backLinkPath', this.get('orderBackLinkPath'));
  }
});
