import AuthorizeRoute from './../authorize';
import Ember from 'ember';

export default AuthorizeRoute.extend({

  model(params) {
    return this.store.findRecord("item", params.item_id, { reload: true });
  },

  afterModel(model) {
    if(model.get('isSet')) {
      model.get('setItem.items').forEach(item => {
        this.store.findRecord("item", item.get("id"), { reload: true });
      });
    }
  },

});
