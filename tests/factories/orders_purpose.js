import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('orders_purpose',{
  sequences: {
    id: function(num) {
      return num + 100;
    }
  },
  default: {
    id:              FactoryGuy.generate('id'),
    purposeId:       '',
    designationId:   '',
    purpose:         FactoryGuy.belongsTo('purpose'),
    designation:     FactoryGuy.belongsTo('designation')
  }
});
export default {};
