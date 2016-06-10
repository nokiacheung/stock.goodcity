import DS from 'ember-data';

var attr = DS.attr,
  belongsTo = DS.belongsTo;

export default DS.Model.extend({

  notes:       attr('string'),
  inventoryNumber: attr('string'),
  quantity:    attr('number'),
  sentOn:      attr('date'),

  designation: belongsTo('designation', { async: false }),
  location:    belongsTo('location', { async: false }),
  image:       belongsTo('image', { async: false }),
  code:        belongsTo('code', { async: false }),

});
