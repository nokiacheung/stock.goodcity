import { computed } from '@ember/object';
import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({

  partialDispatchBackLinkpath: computed.localStorage(),

  queryParams:{
    orderPackageId: null
  },

  beforeModel(){
    this._super(...arguments);
    var previousRoutes = this.router.router.currentHandlerInfos;
    var previousRoute = previousRoutes && previousRoutes.pop();

    if(previousRoute) {
      var routeName = previousRoute.name;
      if(routeName === "items"){
        this.set("partialDispatchBackLinkpath", "items.index");
      } else if(routeName === "items.partial_undesignate" || routeName === 'orders.detail') {
        this.set("partialDispatchBackLinkpath", routeName);
      } else {
        this.set("partialDispatchBackLinkpath", "items.detail");
      }
    }
  },

  model(params){
    return this.store.peekRecord("item", params.item_id) || this.store.findRecord('item', params.item_id);
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('partialDispatchBackLinkpath', this.get('partialDispatchBackLinkpath'));
  }
});
