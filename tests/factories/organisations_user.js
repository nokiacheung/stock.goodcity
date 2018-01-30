import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('organisationsUser', {
  sequences: {
    id: function(num) {
      return num;
    },
    position: function(num) {
      return 'position' + num;
    }
  },

  default: {
    id: FactoryGuy.generate('id'),
    position: FactoryGuy.generate('position'),
    gcOrganisation:   FactoryGuy.belongsTo('gc_organisation'),
    user: FactoryGuy.belongsTo('user')
  }
});

export default {};

