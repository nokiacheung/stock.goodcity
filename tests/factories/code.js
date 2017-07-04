import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('code',{
  sequences: {
    id: function() {
      return Math.floor(Math.random() * 100);
    },
    name: function() {
      return "Baby Crib"+ Math.floor(Math.random() * 100);
    }
  },
  default: {
    id                      : FactoryGuy.generate('id'),
    name                    : FactoryGuy.generate('name'),
    code                    : "BBS",
    otherChildPackages      : "FXX",
    defaultChildPackages    : "BBS",
    otherTerms              : "Cot",
    visibleInSelects        : true,
    location                : FactoryGuy.belongsTo('location')
  }
});
export default { };

