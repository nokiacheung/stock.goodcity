import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({


  // contactId:           attr('number'),
  gogovanOrderId:     attr('number'),
  gogovanTransportId: attr('number'),
  // id:                   attr('number'),


  timeslot:             attr('string'),
  transportType:        attr('string'),
  vehicleType:          attr('string'),
  scheduledAt:          attr('date'),

  contact:              belongsTo('contact', { async: false }),
  // order: attr('number'),


  needEnglish:          attr("boolean"),
  needCart:             attr("boolean"),
  needCarry:            attr("boolean"),

});
