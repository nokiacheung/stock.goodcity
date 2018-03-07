import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('gc_organisation', {

  sequences: {
    id: function(num) {
      return num;
    }
  },
  default: {
    id:               FactoryGuy.generate('id'),
    name:             'GoodCity',
    organisationsUsers: FactoryGuy.hasMany('organisationsUser')
  }
});
