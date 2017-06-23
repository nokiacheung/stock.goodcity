import Ember from 'ember'

export default Ember.Route.extend({
  model(params) {
    return this.store.peekAll("order_transport").get('firstObject');
  },
});
