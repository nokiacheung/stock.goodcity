import Ember from "ember";
import DS from 'ember-data';

export default DS.Model.extend({
  favourite:     DS.attr('boolean'),
  cloudinaryId:  DS.attr('string'),

  imageUrl: Ember.computed('cloudinaryId', function(){
    return this.generateUrl();
  }),

  thumbImageUrl: Ember.computed('cloudinaryId', function(){
    return this.generateUrl(120, 120, true);
  }),

  generateUrl: function(width, height, crop) {
    //e.g. cloudinaryId = 1406959628/wjvaksnadntp239n6vwe.png
    var id = this.get('cloudinaryId');
    if (!id || id.indexOf("/") === -1) {
      return null;
    }

    if (!width) {
      width = ",w_" + width;
    }

    if (!height) {
      height = ",h_" + height;
    }

    crop = crop === true ? "c_fill" : "c_fit";

    return `https://res.cloudinary.com/ddoadcjjl/image/upload/${crop},fl_progressive${height}${width}/v${id}`;
  }
});
