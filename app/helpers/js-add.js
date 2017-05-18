import Ember from "ember";

// Date Format used in App:
// "12 Feb '16" => "DD MMM 'YY"

export default Ember.Helper.helper(function(leftside, rightside) {
  if(rightside) {
    return leftside[0] + leftside[1];
  }
});
