import Ember from "ember";
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({

  quantity:        attr('number'),
  notes:           attr('string'),
  createdAt:       attr('date'),
  updatedAt:       attr('date'),
  imageId:         attr('number'),
  inventoryNumber: attr('string'),

  image: Ember.computed('imageId', function() {
    return this.store.peekRecord("image", this.get("imageId"));
  }),

  displayImageUrl: Ember.computed.alias("image.thumbImageUrl")

});
