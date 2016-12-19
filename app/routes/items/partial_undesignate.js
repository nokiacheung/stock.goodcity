import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({

  model(params) {
    var item = this.store.peekRecord("item", params.item_id) || this.store.findRecord('item', params.item_id);
    return item;
  },

  afterModel(model) {
    model.get('ordersPackages').forEach( orderPackage => {
      this.store.peekRecord("designation", orderPackage.get('designationId')) || this.store.findRecord("designation", orderPackage.get('designationId'));
    });
  },
});
