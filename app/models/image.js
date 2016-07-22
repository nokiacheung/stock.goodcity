import Ember from "ember";
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  favourite:     attr('boolean'),
  cloudinaryId:  attr('string'),

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

    width = width ? (",w_" + width) : "";
    height = height ? (",h_" + height) : "";

    crop = crop === true ? "c_fill" : "c_fit";

    return `https://res.cloudinary.com/ddoadcjjl/image/upload/${crop},fl_progressive${height}${width}/v${id}`;
  }
});
