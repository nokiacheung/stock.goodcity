import AuthorizeRoute from './../authorize';
import Ember from 'ember';

export default AuthorizeRoute.extend({

  queryParams: {
    showDispatchOverlay: false,
    caseNumber: ''
  },

  model(params) {
    return this.store.findRecord("item", params.item_id, { reload: true });
  },

  itemBackLinkPath: Ember.computed.localStorage(),

  beforeModel() {
    var previousRoutes = this.router.router.currentHandlerInfos;
    var previousRoute = previousRoutes && previousRoutes.pop();
    var path = "items.index";

    if(previousRoute) {
      var routeName = previousRoute.name;
      if(routeName.indexOf("items")) {
        path = routeName;
      } else if(routeName === path) {
        path = path;
      } else if(routeName.indexOf("items") === 0) {
        path = this.get("itemBackLinkPath") || path;
      }
    }

    this.set("itemBackLinkPath", path);
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('backLinkPath', this.get('itemBackLinkPath'));
  }

});
