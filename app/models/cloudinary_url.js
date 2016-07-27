import Model from 'ember-data/model';

export default Model.extend({
  generateUrl: function(width, height, crop) {
    //e.g. cloudinaryId = 1406959628/wjvaksnadntp239n6vwe.png
    var id = this.get('cloudinaryId') || "1438323573/default/test_image.jpg";
    if (!id || id.indexOf("/") === -1) {
      return null;
    }

    width = width ? (",w_" + width) : "";
    height = height ? (",h_" + height) : "";

    crop = crop === true ? "c_fill" : "c_fit";

    return `https://res.cloudinary.com/ddoadcjjl/image/upload/${crop},fl_progressive${height}${width}/v${id}`;
  }
});
