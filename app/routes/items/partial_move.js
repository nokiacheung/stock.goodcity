import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({
  model(params){
     var item = this.store.peekRecord("item", params.item_id);
     return item || this.store.findRecord('item', params.item_id);
  }
});
