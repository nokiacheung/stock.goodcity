import Ember from 'ember';
import numericInlineInput from './numeric-inline-input';
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default numericInlineInput.extend({

  focusOut() {
    var val = this.attrs.value.value;
    var regexPattern = /^\d+$/;
    if(val && val.toString().search(regexPattern) !== 0){
      this.set('value', val.replace(/\D/g,''));
    }
    var request = this.get("request");
    var url = `/requests/${request.get('id')}`;
    var key = this.get('name');
    var requestParams = {};
    requestParams[key] = this.get('value') || '';

    if(parseInt(val, 10) === 0) {
      this.set("value",  request._internalModel._data.quantity);
      Ember.$(this.element).removeClass('numeric-inline-input');
      return false;
    }

    if(parseInt(requestParams[key], 10) === 0)
    {
      Ember.$(this.element).removeClass('numeric-inline-input');
      this.set('value','');
      return false;
    }

    Ember.$(this.element).removeClass('numeric-inline-input');
    if (requestParams[key].toString() !== this.get('previousValue').toString()){
      var loadingView = getOwner(this).lookup('component:loading').append();
      new AjaxPromise(url, "PUT", this.get('session.authToken'), { request: requestParams })
        .then(data => {
          this.get("store").pushPayload(data);
        })
        .finally(() => {
          loadingView.destroy();
        });
    }
  }
});
