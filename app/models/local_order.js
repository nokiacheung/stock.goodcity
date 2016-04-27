import DS from 'ember-data';

var attr = DS.attr;

export default DS.Model.extend({

  clientName: attr('string'),
  hkidNumber: attr('string'),

  items:      DS.hasMany({ async: true })

});
