import FactoryGuy from 'ember-data-factory-guy';
import './item';

FactoryGuy.define('designation', {
  sequences: {
    id: function(num) {
      return num;
    },
    code: function(num) {
      var code = 24400 + num;
      return "L" + code;
    }
  },
  default: {
    id:               FactoryGuy.generate('id'),
    code:             FactoryGuy.generate('code'),
    detailType:       'StockitLocalOrder',
    status:           'Active',
    createdAt:        '12/07/2016',
    updatedAt:        '12/07/2016',
    orders_packages:   FactoryGuy.hasMany('orders_package'),
  },
  designation_with_item: {
    item: FactoryGuy.hasMany('item')
  }
});
