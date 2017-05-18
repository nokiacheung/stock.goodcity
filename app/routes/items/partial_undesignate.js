import AuthorizeRoute from './../authorize';
import Ember from 'ember';

export default AuthorizeRoute.extend({
  partialUndesignateBackLinkpath: Ember.computed.localStorage(),

  beforeModel() {
    this._super(...arguments);
    var previousRoutes = this.router.router.currentHandlerInfos;
    var previousRoute = previousRoutes && previousRoutes.pop();

    if(previousRoute) {
      var routeName = previousRoute.name;
      if(routeName === "items"){
        this.set("partialUndesignateBackLinkpath", "items.index");
      } else {
        this.set("partialUndesignateBackLinkpath", "items.detail");
      }
    }
  },

  model(params) {
    var item = this.store.peekRecord("item", params.item_id) || this.store.findRecord('item', params.item_id);
    return item;
  },

  afterModel(model) {
    var designation = null;
    if(model) {
      model.get('ordersPackages').forEach( orderPackage => {
        designation =  this.store.peekRecord("designation", orderPackage.get('designationId')) || this.store.findRecord("designation", orderPackage.get('designationId'));
      });
    }
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('partialUndesignateBackLinkpath', this.get('partialUndesignateBackLinkpath'));
  }
});
