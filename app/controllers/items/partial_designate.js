import Ember from "ember";

export default Ember.Controller.extend({
  item: null,
  partial_qnty: Ember.computed.localStorage(),

  totalInHandItems: Ember.computed('item.quantity', function() {
    return this.get('item.quantity');
  }),

  actions: {
    designate_partial_qty(item) {
      var partial_qty = parseInt(Ember.$(`#${item.id}`)[0].value);
      this.set('partial_qnty', partial_qty);
      this.transitionToRoute('items.search_order', item.id, {queryParams: {partial_qty: partial_qty, partial_qnty: this.get('partial_qnty')}});
    }
  }
});
