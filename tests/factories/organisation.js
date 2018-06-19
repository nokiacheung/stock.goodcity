import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('organisation',{
  default: {
    name:   FactoryGuy.generate('name'),
    orders: FactoryGuy.hasMany('order')
  }
});
export default {};
