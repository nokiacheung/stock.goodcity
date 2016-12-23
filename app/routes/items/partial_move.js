import Ember from 'ember';
import AuthorizeRoute from './../authorize';
const { getOwner } = Ember;

export default AuthorizeRoute.extend({
  model(params){
    getOwner(this).lookup('controller:items.search_location').set('partialRoute', true);
     var item = this.store.peekRecord("item", params.item_id);
     return item || this.store.findRecord('item', params.item_id);
  }
});
