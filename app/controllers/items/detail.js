import Ember from "ember";

export default Ember.Controller.extend({
  item: Ember.computed.alias("model"),

  previewImageBgCss: Ember.computed("model.imageUrl", function() {
    return new Ember.Handlebars.SafeString("background: linear-gradient(180deg, rgba(0, 0, 0, 1) -50%, transparent), url(" + this.get("model.imageUrl") + ") center;");
  }),

});
