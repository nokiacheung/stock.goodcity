import Ember from 'ember';

export default Ember.Component.extend({

  previewImageBgCss: Ember.computed("item.imageUrl", function() {
    return new Ember.Handlebars.SafeString("background: linear-gradient(180deg, rgba(0, 0, 0, 1) -50%, transparent), url(" + this.get("item.imageUrl") + ") center;");
  }),

  lightGallery: null,
  item: null,

  didInsertElement(){
      var _this = this;

      this._super();

      Ember.run.scheduleOnce('afterRender', this, function(){
        var lightGallery = Ember.$("#itemImage").lightGallery({
          mode: 'lg-soft-zoom',
          closable: true,
          zoom: true,
          counter: true,
          scale: 1,
          download: false,
          enableTouch : true,
          selector: '.imageZoom'
        });

        _this.set("lightGallery", lightGallery);

      });

    },

  willDestroyElement() {
    Ember.$('#itemImage').data('lightGallery').destroy(true);
  }

});
