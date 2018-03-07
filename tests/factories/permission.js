import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('permission', {
  sequences: {
    id: function(num) {
      return num + 100;
    }
  },
  default: {
    id:    FactoryGuy.generate('id'),
    name:  "Supervisor",
    user:  FactoryGuy.belongsTo('user'),
    userProfile:  FactoryGuy.belongsTo('user_profile'),
  }
});

export default {};
