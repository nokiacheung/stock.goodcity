import FactoryGuy from 'ember-data-factory-guy';
import './designation';

FactoryGuy.define('item', {
  sequences: {
    id: function(num) {
      return num;
    },
    inventoryNumber: function (num) {
      var inventory = 24400 + num;
      return "C" + inventory;
    },
    itemId: function (num) {
      return num;
    }
  },
  default: {
    id:               FactoryGuy.generate('id'),
    inventoryNumber:  "C4234",
    itemId:           FactoryGuy.generate('itemId'),
    state:            'submitted',
    createdAt:        '12/01/2016',
    updatedAt:        '12/01/2016',
    notes:             "Example",
    orders_packages:   FactoryGuy.hasMany('orders_package'),
    // designation:      FactoryGuy.belongsTo('designation')
  }
});

export default {};
