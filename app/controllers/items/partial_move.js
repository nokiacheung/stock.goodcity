import Ember from "ember";

export default Ember.Controller.extend({
  item: null,
  isZeroQuantity: false,

  totalInHandItems: Ember.computed('item.quantity', function() {
    return this.get('item.quantity');
  }),

  packagesLoacationQty: Ember.computed.localStorage(),
  totalQty: Ember.computed.localStorage(),
  originalQty: null,

  actions: {
    move_partial_qty(item) {
      var totalQty = 0;
      var allPackagesLocations = item.get('packagesLocations');
      var elementIds  = allPackagesLocations.getEach('id');
      var packagesLoacationQty = [];
      var record = {};
      elementIds.forEach(packages_location_id => {
        var value = parseInt(Ember.$(`#${packages_location_id}`)[0].value);
        var packages_location = this.get('store').peekRecord('packages_location', packages_location_id);
        record["packages_location_id"] = packages_location_id;
        record["package_id"] = packages_location.get('package_id');
        record["new_qty"] = value;
        totalQty += value;
        packagesLoacationQty.push(record);
        record = {};
      });
      this.set("packagesLoacationQty", packagesLoacationQty);
      this.set("totalQty", totalQty);
      if(this.get('totalQty') === 0){
        this.set("isZeroQuantity", true);
      }else{
        this.transitionToRoute('items.search_location', item.id, { queryParams: { isPartialMove: true }});
      }
    }
  }
});
