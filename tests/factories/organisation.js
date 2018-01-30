import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('organisation',{
  default: {
    name:   FactoryGuy.generate('name'),
  }
});
export default {};
