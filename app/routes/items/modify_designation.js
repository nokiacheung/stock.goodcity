import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({

  queryParams: {
    ordersPackageId: false,
  },
  ordersPackageId: null,

  model(params) {
    this.set("ordersPackageId", params.ordersPackageId);
    var item = this.store.peekRecord("item", params.item_id);
    var orderPackage = this.store.peekRecord("orders_package", params.ordersPackageId);
    return Ember.RSVP.hash({
      item: item || this.store.findRecord('item', params.item_id),
      ordersPackage: orderPackage || this.store.findRecord("orders_package", params.ordersPackageId)
    });
  },

  afterModel(model) {
    var ordersPkg = model.ordersPackage;
    var designation =  this.store.peekRecord("designation", ordersPkg.get('designationId')) || this.store.findRecord("designation", ordersPkg.get('designationId'));
    return ordersPkg;
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set("ordersPackageId", this.get("ordersPackageId"));
  }
});
