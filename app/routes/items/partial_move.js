import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({
  model(params){
     var item = this.store.peekRecord("item", params.item_id);
     return item || this.store.findRecord('item', params.item_id);
  },

  afterModel(model){
    if(model.get('isSet')){
      model.get('setItem.items').forEach(record => {
        this.store.findRecord('item', record.get('id'));
      });
    }
  }
});
