import Ember from 'ember';

export default Ember.Component.extend({

  lightGallery: null,

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
