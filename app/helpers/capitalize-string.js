import Ember from "ember";

export default Ember.Helper.helper(function(value) {
  return value[0].capitalize();
});
