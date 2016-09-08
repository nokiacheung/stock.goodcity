import Ember from 'ember';
import AutoResizableTextarea from './auto-resize-textarea';
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default AutoResizableTextarea.extend({
  previousValue: '',
  store: Ember.inject.service(),
  item: null,

  didInsertElement() {
    Ember.$('.description-error').hide();
    Ember.$('.remove-text').hide();
    Ember.$(this.element).addClass('description-overflow');
  },

  focusOut() {
    var item = this.get("item");
    var url = `/packages/${item.get('id')}`;
    var key = this.get('name');
    var value = this.attrs.value.value;
    var packageParams = {};
    this.element.nextElementSibling.setAttribute('id', 'dsc' + item.id);
    packageParams[key] = this.get('value') || '';

    if(value.toString() === ''){
      this.set('value', this.get('previousValue'));
      this.$().focus();
      Ember.$('#dsc' + item.id).show();
      return false;
    }

    if (packageParams[key].toString().trim() !== this.get('previousValue').toString().trim()){
      var loadingView = getOwner(this).lookup('component:loading').append();
      new AjaxPromise(url, "PUT", this.get('session.authToken'), {package: packageParams })
        .then(data => {
          this.get("store").pushPayload(data);
        })
        .finally(() => {
          loadingView.destroy();
        });
    }
    this.element.value = value.trim();
    Ember.$(this.element).removeClass('item-description-textarea');
    Ember.$(this.element).addClass('description-overflow');
    Ember.$('.remove-text').hide();
    Ember.$('#dsc' + item.id).hide();
  },

  focusIn() {
    Ember.$(this.element).addClass('item-description-textarea');
    Ember.$(this.element).removeClass('description-overflow');
    Ember.$('.remove-text').show();
    this.set('previousValue', this.get('value') || '');
  },

  click() {
    Ember.$(this.element).addClass('item-description-textarea');
    Ember.$(this.element).removeClass('description-overflow');
    Ember.$('.remove-text').show();
    this.set('previousValue', this.get('value') || '');
  },
});
