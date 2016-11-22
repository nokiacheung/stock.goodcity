import Ember from "ember";

export default Ember.TextField.extend({
  tagName: "input",
  type:    "text",
  maxlength: "25",
  attributeBindings: [ "name", "id", "value", 'placeholder'],
  cordova: Ember.inject.service(),
  store: Ember.inject.service(),
  hasRecentDesignations: true,
  isItemsIndex: false,

  triggerAutofocus: Ember.observer("value", function() {
    if (this.get('value').length === 0) {
      this.$().focus();
    }
  }),

  didRender() {
    if(this.get('hasRecentDesignations') && this.get('isItemsIndex')) {
      var records = this.get('store').query('designation', { recently_used: true });
      this.get('store').pushPayload(records);
      this.set('hasRecentDesignations', false);
    }
  },

  hasFixedInputHeader: Ember.computed(function() {
    return this.get("cordova").isIOS() && Ember.$(".fixed_search_header").length > 0;
  }),

  scrollToStart() {
    Ember.$(".fixed_search_header").addClass("absolute");
    Ember.$(".footer").addClass("absolute_footer");
    Ember.$(".search").addClass("no-padding");

    document.body.scrollTop = document.documentElement.scrollTop = 0;
  },

  focusOut(){
    if(this.get("hasFixedInputHeader")) {
      Ember.$(".fixed_search_header").removeClass("absolute");
      Ember.$(".footer").removeClass("absolute_footer");
      Ember.$(".search").removeClass("no-padding");
    }
  },

  didInsertElement() {
    var routes = this.router.router.currentHandlerInfos;
    var currentRoute = routes.pop();
    var isIndexRoute = currentRoute.name === "items.index" ? true : false;
    this.set('isItemsIndex', isIndexRoute);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.$().focus();
    if(this.get("hasFixedInputHeader")) {
      this.element.addEventListener('touchstart', this.scrollToStart);
    }
  },

  willDestroyElement() {
    if(this.get("hasFixedInputHeader")) {
      this.element.addEventListener('touchstart', this.scrollToStart);
    }
  },

});
