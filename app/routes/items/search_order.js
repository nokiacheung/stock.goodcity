import Ember from "ember";
import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({

  model(params) {
    var item = this.store.peekRecord("item", params.item_id);

    return Ember.RSVP.hash({
      item: item || this.store.findRecord('item', params.item_id),
      designations: this.store.query('designation', { recently_used: true })
    });
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('searchText', "");
  }
});
