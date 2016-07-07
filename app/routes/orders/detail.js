import getOrderRoute from './get_order';

export default getOrderRoute.extend({

  backLinkPath: Ember.computed.localStorage(),

  beforeModel() {
    var previousRoutes = this.router.router.currentHandlerInfos;
    var previousRoute = previousRoutes && previousRoutes.pop();
    if(previousRoute) { this.set("backLinkPath", previousRoute.name); }
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('displayAllItems', model.get('items.length') <= 3);

    var path = this.get('backLinkPath') !== null ? this.get('backLinkPath') : "orders.index";
    controller.set('backLinkPath', path);

  }
});
