import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({

  clientName: attr('string'),
  hkidNumber: attr('string'),
  referenceNumber: attr('string'),
  purposeOfGoods: attr('string')
});
