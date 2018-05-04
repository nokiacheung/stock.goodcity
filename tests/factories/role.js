import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('user_role',{
  sequences: {
    id: function(num) {
      return num + 100;
    }
  },
  default: {
    id:           FactoryGuy.generate('id'),
    name:     "Supervisor"
  }
});
export default {};
