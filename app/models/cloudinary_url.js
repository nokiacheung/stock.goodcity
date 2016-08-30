import Ember from "ember";
import Model from 'ember-data/model';

export default Model.extend({
  generateUrl: function(width, height, crop) {
    var id = this.get('cloudinaryId') || "1438323573/default/test_image.jpg";
    var angle = this.get('angle') || 0;
    if (!id || id.indexOf("/") === -1) {
      return null;
    }
    var version = id.split("/")[0];
    var filename = id.substring(id.indexOf("/") + 1);
    var options = {
      version: version,
      height: height,
      width: width,
      crop: crop === true ? 'fill' : 'fit',
      flags: "progressive",
      id: id,
      secure: true,
      protocol: 'https:'
    };
    if(angle) { options["angle"] = angle; }
    return Ember.$.cloudinary.url(filename, options);
  }
});
