import attr from 'ember-data/attr';
import Addressable from './addressable';

export default Addressable.extend({
  name:   attr('string'),
  mobile: attr('string')
});



