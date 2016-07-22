import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import Ember from "ember";

export default Model.extend({

  notes:           attr('string'),
  grade:           attr('string'),
  inventoryNumber: attr('string'),
  quantity:        attr('number'),

  length:          attr('number'),
  width:           attr('number'),
  height:          attr('number'),

  sentOn:          attr('date'),
  isSet:           attr('boolean'),
  itemId:          attr('number'),

  designation: belongsTo('designation', { async: false }),
  location:    belongsTo('location', { async: false }),
  image:       belongsTo('image', { async: false }),
  code:        belongsTo('code', { async: false }),
  donorCondition: belongsTo('donor_condition', { async: false }),

  isDispatched: Ember.computed.bool('sentOn'),
  updatedAt: attr("date"),

});
