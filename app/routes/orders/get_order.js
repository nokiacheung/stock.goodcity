import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({

  model(params) {
    return this.store.findRecord("designation", params.order_id);
  }

});
