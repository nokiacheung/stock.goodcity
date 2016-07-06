import getOrderRoute from './get_order';

export default getOrderRoute.extend({

  backLinkPath: Ember.computed.localStorage(),

  beforeModel() {
    var previousRoutes = this.router.router.currentHandlerInfos;
    var previousRoute = previousRoutes && previousRoutes.pop();

    if(previousRoute){
      var parentRoute = previousRoutes[1];
      var hasParentRoute = parentRoute && parentRoute.name === "items";
      var isSearchRoute = previousRoute.name === "orders.index";

      if(!isSearchRoute && hasParentRoute) {
        this.set("backLinkPath", previousRoute.name);
      } else if(isSearchRoute) {
        this.set("backLinkPath", "orders.index");
      }
    }
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('displayAllItems', model.get('items.length') <= 3);

    if(this.get('backLinkPath') !== null) {
      controller.set('backLinkPath', this.get('backLinkPath'));
    } else {
      controller.set('backLinkPath', "orders.index");
    }
  }
});
