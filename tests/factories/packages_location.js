import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('packages_location',{
  sequences: {
    id: function(num) {
      return num + 100;
    }
  },
  default: {
    id:              FactoryGuy.generate('id'),
    quantity:        1,
    item:            FactoryGuy.belongsTo('item'),
    location:        FactoryGuy.belongsTo('location')
  }
});
export default {};
