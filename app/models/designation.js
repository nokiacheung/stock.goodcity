import DS from 'ember-data';

var attr = DS.attr,
    belongsTo = DS.belongsTo;

export default DS.Model.extend({

  status:       attr('string'),
  createdAt:    attr('date'),
  code:         attr('string'),
  detailType:   attr('string'),
  detailId:     attr('number'),

  contact:      belongsTo('contact', { async: false }),
  organisation: belongsTo('organisation', { async: false }),
  localOrder:   belongsTo('local_order', { async: false }),

});
