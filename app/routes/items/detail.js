import AuthorizeRoute from './../authorize';
import Ember from 'ember';

export default AuthorizeRoute.extend({

  queryParams: {
    showDispatchOverlay: false,
  },

  model(params) {
    return this.store.findRecord("item", params.item_id, { reload: true });
  },

  afterModel(model) {
    if(model.get('isSet')) {
      return Ember.RSVP.hash({
        items: model.get('setItem.items').forEach(item => {
          this.store.findRecord("item", item.get("id"), { reload: true });
        })
      });
    }
  },

  itemBackLinkPath: Ember.computed.localStorage(),

  beforeModel() {
    this._super(...arguments);
    var previousRoutes = this.router.router.currentHandlerInfos;
    var previousRoute = previousRoutes && previousRoutes.pop();
    var path = "items.index";

    if(previousRoute) {
      var routeName = previousRoute.name;
      if(routeName === "items.new"){
        path = path;
      } else if(routeName.indexOf("items") === 0) {
        path = this.get("itemBackLinkPath") || path;
      } else if(routeName === path) {
        path = path;
      }
      else if(routeName.indexOf("items") > -1 || routeName === "orders.detail"){
        path = routeName;
      }
    }

    this.set("itemBackLinkPath", path);
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('callOrderObserver', false);
    controller.set('backLinkPath', this.get('itemBackLinkPath'));
  }

});
