import Ember from 'ember';
import AjaxPromise from 'stock/utils/ajax-promise';
import config from '../config/environment';
const { getOwner } = Ember;

export default Ember.TextField.extend({
  tagName: "input",
  type: "text",
  isMobileApp: config.cordova.enabled,
  isEditable: false,
  attributeBindings: [ "name", "type", "value", "maxlength", "id", "autoFocus" , "placeholder", "required", "pattern"],
  store: Ember.inject.service(),
  previousValue: '',
  displayScanner: false,
  item: null,

  focusTrigger: Ember.observer('value', function() {
    this.$().focus();
  }),

  didInsertElement() {
    var id = this.get("item.id");
    Ember.$('#'+id).hide();
  },

  removeScanner() {
    this.set('displayScanner',false);
  },

  focusOut() {
    var item = this.get("item");
    var url = `/packages/${item.get('id')}`;
    var key = this.get('name');
    var packageParams = {};
    packageParams[key] = this.get('value') || '';

    if(!this.element.validity.valid){
      this.$().focus();
      Ember.$('#'+item.id).show();
    }
    var value = this.attrs.value.value;
    var regexPattern = /^(CAS\-\d{5})$/;

    if(value && value.toString().search(regexPattern) !== 0){
      this.set('value', this.get('previousValue'));
      this.$().focus();
      Ember.$('#'+item.id).show();
      return false;
    }

    Ember.$(this.element).removeClass('inline-text-input');
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
    Ember.$(this.element).removeClass('inline-text-input');
    Ember.$('#'+item.id).hide();
    Ember.run.debounce(this, this.removeScanner, 2000);
  },

  focusIn() {
    Ember.$(this.element).addClass('inline-text-input');
    if(this.get('isMobileApp')) {
      this.set('displayScanner', true);
    }
  },

  click() {
    Ember.$(this.element).addClass('inline-text-input');
    if(this.get('isMobileApp')) {
      this.set('displayScanner', true);
    }
    this.set('previousValue', this.get('value') || '');
  },
});
