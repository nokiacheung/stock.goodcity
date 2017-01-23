import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('code',{
  sequences: {
    id: function(num) {
      return num + 100;
    }
  },
  default: {
    id:              FactoryGuy.generate('id'),
    quantity:        1,
    sentOn:          '',
    state:           '',
    item:            FactoryGuy.belongsTo('item'),
    designation:     FactoryGuy.belongsTo('designation'),
  }
});
export default {};
