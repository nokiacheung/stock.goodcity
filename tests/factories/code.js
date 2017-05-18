import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('code',{
  sequences: {
    id: function(num) {
      return num + 100;
    },
    name: function(num) {
      return "Baby Crib";// + num;
    }
  },
  default: {
    id                      : FactoryGuy.generate('id'),
    name                    : FactoryGuy.generate('name'),
    code                    : "BBS",
    otherChildPackages    : "FXX",
    defaultChildPackages  : "BBS",
    otherTerms             : "Cot",
    visibleInSelects      : true,
    location                : FactoryGuy.belongsTo('location')
  }
});
export default { };

