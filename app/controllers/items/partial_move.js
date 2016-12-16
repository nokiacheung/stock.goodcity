import Ember from "ember";

export default Ember.Controller.extend({
  item: null,

  totalInHandItems: Ember.computed('item.quantity', function() {
    return this.get('item.quantity');
  }),

  actions: {
    move_partial_qty(item) {
      var partial_qty = parseInt(Ember.$(`#${item.id}`)[0].value);
      this.transitionToRoute('items.search_location', item.id, {queryParams: {partial_qty: partial_qty}});
    }
  }
});
