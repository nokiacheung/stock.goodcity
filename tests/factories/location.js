import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('location', {
  default: {
    building: FactoryGuy.generate(function(num) {
      return "building" + num;
    }),

    area: FactoryGuy.generate(function(num) {
      return "area" + num;
    })
  }
});

export default {};
