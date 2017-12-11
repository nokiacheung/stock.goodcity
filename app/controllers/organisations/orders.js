import config from '../../config/environment';
import Ember from "ember";

export default Ember.Controller.extend({
  filteredResults: Ember.computed.alias('model.orders')
  // filteredResults: Ember.computed(function(){
  //   return this.store.peekAll("Order");
  // }),
});
