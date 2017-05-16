import Ember from "ember";
import AuthorizeRoute from './../authorize';
const { getOwner } = Ember;

export default AuthorizeRoute.extend({

  queryParams: {
    isSet: false,
    showDispatchOverlay: false,
    partial_qty: 0
  },

  partial_qnty: Ember.computed.localStorage(),

  partialDesignatePath: true,
  itemDesignateBackLinkPath: Ember.computed.localStorage(),

  beforeModel() {
    getOwner(this).lookup('controller:items.detail').set('callOrderObserver', true);
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
        this.set('partialDesignatePath', true);
      } else {
        this.set('partialDesignatePath', false);
      }
    }

    if(parseInt(window.localStorage.getItem('partial_qnty'))) {
      this.set('partialDesignatePath', true);
    } else {
      this.set('partialDesignatePath', false);
    }
    this.set("itemDesignateBackLinkPath", "items.detail");
  },

  model(params) {
    var item = this.store.peekRecord("item", params.item_id);
    var recentlyUsedDesignations = this.store.peekAll('designation').filterBy('recentlyUsedAt');
    recentlyUsedDesignations.forEach(record => {
        if(record.constructor.toString() === "stock@model:designation:") {
          this.store.query("orders_package", { search_by_order_id: record.get("id")
        });
        }
      });

    return Ember.RSVP.hash({
      item: item || this.store.findRecord('item', params.item_id),
      designations: recentlyUsedDesignations.get('length') !== 0 ? recentlyUsedDesignations : this.get('store').query('designation', { recently_used: true })
    });
  },

  setupController(controller, model){
    this._super(controller, model);
    if(!this.get('partialDesignatePath') && !parseInt(window.localStorage.getItem('partial_qnty'))) {
      controller.set('partial_qty', 0);
      controller.set('notPartialRoute', true);
    } else {
      controller.set('notPartialRoute', false);
    }
    controller.set("disableMessageBoxLink", true);
    controller.set('searchText', "");
    controller.set('backLinkPath', this.get('itemDesignateBackLinkPath'));
  }
});
