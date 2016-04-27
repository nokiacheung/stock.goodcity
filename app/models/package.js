import Ember from "ember";
import DS from 'ember-data';

export default DS.Model.extend({

  quantity:        DS.attr('number'),
  notes:           DS.attr('string'),
  createdAt:       DS.attr('date'),
  updatedAt:       DS.attr('date'),
  imageId:         DS.attr('number'),
  inventoryNumber: DS.attr('string'),

  image: Ember.computed('imageId', function() {
    return this.store.peekRecord("image", this.get("imageId"));
  }),

  displayImageUrl: Ember.computed.alias("image.thumbImageUrl")

});
