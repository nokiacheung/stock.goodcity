import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({

  previewImageBgCss: Ember.computed("item.imageUrl", function() {
    return new Ember.Handlebars.SafeString("background: linear-gradient(180deg, rgba(0, 0, 0, 1) -50%, transparent), url(" + this.get("item.imageUrl") + ") center;");
  }),

  lightGallery: null,
  item: null,
  isMobileApp: config.cordova.enabled,

  actions: {
    imageZoom(imageUrl) {
      window.PhotoViewer.show(imageUrl, '', {share:false});
    }
  },

  didInsertElement(){
    if(!this.get("isMobileApp")){
        var _this = this;
        this._super();
        Ember.run.scheduleOnce('afterRender', this, function(){
        var lightGallery = Ember.$("#itemImage").lightGallery({
          mode: 'lg-slide',
          zoom: true,
          download: false,
          scale: 1,
          hideControlOnEnd: true,
          closable: true,
          loop: true,
          counter: true,
          enableTouch : true,
          enableDrag: true,
          selector: '.imageZoom'
        });
        _this.set("lightGallery", lightGallery);
      });
    }
  },

  willDestroyElement() {
    if(!this.get("isMobileApp")){
      Ember.$('#itemImage').data('lightGallery').destroy(true);
    }
  }
});
