import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({

  partialDispatchBackLinkpath: Ember.computed.localStorage(),

  queryParams:{
    orderPackageId: null
  },

  beforeModel(){
    this._super(...arguments);
    var previousRoutes = this.router.router.currentHandlerInfos;
    var previousRoute = previousRoutes && previousRoutes.pop();

    if(previousRoute) {
      var routeName = previousRoute.name;
      debugger
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
});
