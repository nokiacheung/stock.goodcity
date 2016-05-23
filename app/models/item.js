import DS from 'ember-data';

var attr = DS.attr,
  belongsTo = DS.belongsTo;

export default DS.Model.extend({

  description: attr('string'),
  quantity:    attr('number'),
  sentOn:      attr('date'),

  designation: belongsTo('designation', { async: false }),
  image:       belongsTo('image', { async: false }),

});
