import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('schedule',{
  sequences: {
    id: function(num) {
      return num + 100;
    },
    name: function(num) {
      return 'Daniel' + num;
    },
    slot: function(num) {
      return num;
    }
  },
  default: {
    id:           FactoryGuy.generate('id'),
    resource:     FactoryGuy.generate('name'),
    slot:         FactoryGuy.generate('slot'),
    slotName:     'Afternoon, 2pm-4pm',
    zone:         'zone',
    scheduledAt:  (new Date(new Date().setDate(new Date().getDate()-1)))
  }
});
export default {};
