import AuthorizeRoute from './authorize';

export default AuthorizeRoute.extend({
  model(params) {
    return this.store.peekRecord("orders_package", params.ordersPackageId) || this.store.findRecord(
      "gc_organisation", params.organisation_id, { reload: true });
  },
});
