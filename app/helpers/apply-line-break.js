import { htmlSafe } from '@ember/string';
import { helper } from '@ember/component/helper';
import Ember from "ember";

export default helper(function(value) {
  value = Ember.Handlebars.Utils.escapeExpression(value || "");
  value = value.replace(/(\r\n|\n|\r)/gm, '<br>');
  return new htmlSafe(value);
});
