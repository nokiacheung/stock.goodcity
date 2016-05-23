import Ember from "ember";

export default Ember.Controller.extend({

  displayAllItems: false,

  itemsList: Ember.computed('model.items', 'displayAllItems', function() {
    return this.get("displayAllItems") ? this.get("model.items") : this.get("model.items").slice(0, 3);
  }),

  actions: {
    displayAllItems() {
      this.set("displayAllItems", true);
    }
  }

});
