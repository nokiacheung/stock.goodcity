import Ember from "ember";

export default Ember.Controller.extend({
  item: null,
  partial_qnty: Ember.computed.localStorage(),
  designateFullSet: Ember.computed.localStorage(),

  totalInHandItems: Ember.computed('item.quantity', function() {
    return this.get('item.quantity');
  }),

  returnsDesignateFullSet: Ember.computed('item.setItem.items', function() {
    return !window.localStorage.getItem('designateFullSet').includes(false);
  }),

  minSetQty: Ember.computed('item.setItem.items', function() {
    if(this.get('item.isSet') && !window.localStorage.getItem('designateFullSet').includes(false)) {
      var setItems = this.get('item.setItem.items');
      var minQty = setItems.canonicalState[0]._data.quantity;
      setItems.canonicalState.forEach(record =>{
        var qty = record._data.quantity;
        if(qty < minQty) {
          minQty = qty;
        }
      });
      return minQty;
    } else {
      return this.get('item.quantity');
    }
  }),

  actions: {
    designate_partial_qty(item) {
      var partial_qty = parseInt(Ember.$(`#${item.id}`)[0].value, 10);
      this.set('partial_qnty', partial_qty);
      this.transitionToRoute('items.search_order', item.id, {queryParams: {partial_qty: partial_qty, partial_qnty: this.get('partial_qnty')}});
    }
  }
});
