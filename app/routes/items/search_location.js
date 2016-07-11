import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({
  model(params) {
    return this.store.peekRecord("item", params.item_id);
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('searchText', "");
  }
});
