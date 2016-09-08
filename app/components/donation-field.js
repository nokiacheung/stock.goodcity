import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
  caseNumber: Ember.computed.alias('item.caseNumber'),
  isMobileApp: config.cordova.enabled,

  caseNumberStr: Ember.observer('caseNumber', function() {
    this.get('item').set('caseNumber', this.get('caseNumber'));
  }),
});
