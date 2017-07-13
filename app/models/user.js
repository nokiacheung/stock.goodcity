import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import Addressable from './addressable';

export default Addressable.extend({
  firstName:   attr('string'),
  lastName:    attr('string'),
  mobile:      attr('string'),
  createdAt:   attr('date'),

  permission:  belongsTo('permission', { async: false })
  // image:       belongsTo('image', { async: false }),
});
