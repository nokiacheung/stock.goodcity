import Ember from 'ember';

export default Ember.Component.extend({
  foundation: null,

  currentClassName: Ember.computed("className", function(){
    return this.get("className") ? `.${this.get('className')}` : document;
  }),

  didInsertElement() {
    this._super();
    this.set("foundation", this.get("currentClassName"));
  }
});
