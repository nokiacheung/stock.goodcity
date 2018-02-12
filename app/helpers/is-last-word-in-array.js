import Ember from "ember";

export default Ember.Helper.helper(function(leftside) {
  return (leftside[1] + 1 < leftside[0]) ? true : false;
});
