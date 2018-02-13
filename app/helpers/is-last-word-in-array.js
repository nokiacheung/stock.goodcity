import Ember from "ember";

export default Ember.Helper.helper(function(leftside) {
  return (leftside[0] > leftside[1] + 1) ? true : false;
});
