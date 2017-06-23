import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({

  contact_id:           attr('number'),

  gogovan_order_id:     attr('number'),
  gogovan_transport_id: attr('number'),
  // id:                   attr('number'),


  timeslot:             attr('string'),
  transportType:        attr('string'),
  vehicleType:          attr('string'),
  scheduledAt:          attr('date'),

  contact:              belongsTo('contact', { async: false }),
  // order: attr('number'),

  transportType:        attr('string'),

  needEnglish:          attr("boolean"),
  needCart:             attr("boolean"),
  needCarry:            attr("boolean"),

});
