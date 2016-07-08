import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('code',{
  sequences: {
    name: function(num) {
      return 'Daniel' + num;
    }
  },
  default: {
    name:   FactoryGuy.generate('name'),
  }
});
export default {};
