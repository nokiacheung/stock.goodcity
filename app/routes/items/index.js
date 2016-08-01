import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({

  queryParams: {
    itemSetId: "",
    searchInput: ""
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('itemSetId', this.paramsFor('items.index').itemSetId);
  }

});
