import Ember from "ember";
import cloudinaryUrl from './cloudinary_url';
import attr from 'ember-data/attr';

export default cloudinaryUrl.extend({
  favourite:     attr('boolean'),
  cloudinaryId:  attr('string'),

  imageUrl: Ember.computed('cloudinaryId', function(){
    return this.generateUrl();
  }),

  thumbImageUrl: Ember.computed('cloudinaryId', function(){
    return this.generateUrl(120, 120, true);
  }),
});
