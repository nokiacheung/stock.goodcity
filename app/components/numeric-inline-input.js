import Ember from 'ember';
import NumericInput from './numeric-input';
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default NumericInput.extend({
  store: Ember.inject.service(),
  previousValue: '',
  tagName: "input",
  type: "text",
  attributeBindings: [ "name", "type", "value", "maxlength", "id", "autoFocus" , "placeholder", "required", "pattern"],

  focusOut() {
    var item = this.get("item");
    var url = `/packages/${item.get('id')}`;
    var key = this.get('name');
    var packageParams = {};
    packageParams[key] = this.get('value') || '';

    if(parseInt(packageParams[key]) === 0)
    {
      Ember.$(this.element).removeClass('numeric-inline-input');
      this.set('value','');
      return false;
    }

    Ember.$(this.element).removeClass('numeric-inline-input');
    if (packageParams[key].toString() !== this.get('previousValue').toString()){
      var loadingView = getOwner(this).lookup('component:loading').append();
      new AjaxPromise(url, "PUT", this.get('session.authToken'), {package: packageParams })
        .then(data => {
          this.get("store").pushPayload(data);
        })
        .finally(() => {
          loadingView.destroy();
        });
    }
  },

  focusIn() {
    this.addCssStyle();
  },

  addCssStyle() {
    Ember.$(this.element).addClass('numeric-inline-input');
    this.set('previousValue', this.get('value') || '');
  },

  click() {
    this.addCssStyle();
  },
});
