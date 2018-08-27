import Ember from 'ember';
import AutoResizableTextarea from './auto-resize-textarea';
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default AutoResizableTextarea.extend({
  previousValue: '',
  store: Ember.inject.service(),
  request: null,


  keyDown() {
    var value = this.element.value;
    if( value.charCodeAt(value.length - 1) === 10 && event.which === 13) {
      return false;
    }
  },

  focusOut() {
    var request = this.get("request");
    var url = `/requests/${request.get('id')}`;
    var key = this.get('name');
    var value = this.attrs.value.value || '';
    var requestParams = {};
    requestParams[key] = this.get('value').trim() || '';

    if (requestParams[key].toString() !== this.get('previousValue').toString().trim()){
      var loadingView = getOwner(this).lookup('component:loading').append();
      new AjaxPromise(url, "PUT", this.get('session.authToken'), {request: requestParams })
        .then(data => {
          this.get("store").pushPayload(data);
        })
        .finally(() => {
          loadingView.destroy();
        });
    }
    this.element.value = value.trim();
    Ember.$(this.element).removeClass('item-description-textarea');
  },

  focusIn() {
    this.addCssStyle();
  },

  addCssStyle() {
    Ember.$(this.element).addClass('item-description-textarea');
    this.set('previousValue', this.get('value') || '');
  },

  click() {
    this.addCssStyle();
  }
});
