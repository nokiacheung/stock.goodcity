import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import Addressable from './addressable';

export default Addressable.extend({
  firstName:   attr('string'),
  lastName:    attr('string'),
  mobile:      attr('string'),
  createdAt:   attr('date'),

  permission:  belongsTo('permission', { async: false }),

  fullName: Ember.computed('firstName', 'lastName', function(){
    return (this.get('firstName') + " " + this.get('lastName'));
  })
  // image:       belongsTo('image', { async: false }),
});
