import Ember from "ember";

// Date Format used in App:
// "12 Feb '16" => "DD MMM 'YY"

export default Ember.Helper.helper(function(leftside) {
  return (leftside[1] + 1 < leftside[0]) ? true : false;
});
