import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('image',{
  default: {
    id                      : FactoryGuy.generate('id'),
    name                    : FactoryGuy.generate('name'),
    cloudinaryId            : "1416902230/mmguhm3zdkonc2nynjue.jpg",
    angle                   : 0,
    favourite               : false,
    imageableType           : "Item",
    item                    : FactoryGuy.belongsTo('item')
  }
});
export default { };

