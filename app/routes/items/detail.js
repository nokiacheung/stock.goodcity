import AuthorizeRoute from './../authorize';
import Ember from 'ember';

export default AuthorizeRoute.extend({
  itemBackLinkPath: Ember.computed.localStorage(),
  transition: null,
  messageBox: Ember.inject.service(),

  queryParams: {
    showDispatchOverlay: false
  },

  model(params) {
    return this.store.findRecord("item", params.item_id, { reload: true });
  },

  afterModel(model) {
    if(!model.get('inventoryNumber')) {
      this.get('transition').abort();
      this.get("messageBox").alert("This item has been marked as missing.", () => {
        this.transitionTo("items.index");
      });
    }
    if(model.get('isSet')) {
      return Ember.RSVP.hash({
        items: model.get('setItem.items').forEach(item => {
          this.store.findRecord("item", item.get("id"), { reload: true });
        })
      });
    }
  },

  beforeModel(transition) {
    this._super(...arguments);
    this.set("transition", transition);
    var previousRoutes = this.router.router.currentHandlerInfos;
    var previousRoute = previousRoutes && previousRoutes.pop();
    var path = "items.index";
    if(previousRoute) {
      var routeName = previousRoute.name;
      if(routeName.indexOf("items") === 0) {
        path = this.get("itemBackLinkPath") || path;
      } else if(routeName.indexOf("items") > -1 || routeName === "orders.detail"){
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
