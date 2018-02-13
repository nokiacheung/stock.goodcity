import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('purpose',{
  sequences: {
    id: function(num) {
      return num + 150;
    }
  },
  default: {
    id:         FactoryGuy.generate('id'),
    nameEn:     FactoryGuy.generate('name')
  }
});
export default {};
