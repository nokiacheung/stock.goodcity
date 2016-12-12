import Ember from "ember";
import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({

  queryParams: {
    isSet: false,
    showDispatchOverlay: false
  },

  itemDesignateBackLinkPath: Ember.computed.localStorage(),

  beforeModel() {
    this._super(...arguments);
    var previousRoutes = this.router.router.currentHandlerInfos;
    var previousRoute = previousRoutes && previousRoutes.pop();

    var path = "items.index";

    if(previousRoute) {
      var routeName = previousRoute.name;
      if(routeName.indexOf("detail")){
        path = routeName;
      }
      if(routeName === "items.partial_designate") {
        path = "items.index";
      }
    }

    this.set("itemDesignateBackLinkPath", path);
  },

  model(params) {
    var item = this.store.peekRecord("item", params.item_id);
    var recentlyUsedDesignations = this.store.peekAll('designation').filterBy('recentlyUsedAt');

    return Ember.RSVP.hash({
      item: item || this.store.findRecord('item', params.item_id),
      designations: recentlyUsedDesignations.get('length') !== 0 ? recentlyUsedDesignations : this.get('store').query('designation', { recently_used: true })
    });
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('searchText', "");
    controller.set('backLinkPath', this.get('itemDesignateBackLinkPath'));
  }
});
