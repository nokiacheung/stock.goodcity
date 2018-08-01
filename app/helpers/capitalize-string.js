import Ember from "ember";

export default Ember.Helper.helper(function(value) {
  if(value[0]) {
    return value[0].capitalize();
  }
});
