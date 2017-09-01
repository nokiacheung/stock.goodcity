import FactoryGuy from 'ember-data-factory-guy';
import mobile from './mobile';

FactoryGuy.define('contact',{
  sequences: {
    name: function(num) {
      return 'Daniel' + num;
    }
  },
  default: {
    name:   FactoryGuy.generate('name'),
    mobile: FactoryGuy.generate(mobile.nonHongKong)
  }
});
export default {};
