import Ember from "ember";
import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({

  model(params) {
    return Ember.RSVP.hash({
      item: this.store.peekRecord("item", params.item_id),
      locations: this.store.query('location', { recently_used: true })
    });
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('searchText', "");
  }
});
