import Ember from "ember";

export default Ember.Controller.extend({
  queryParams: ['isSet'],
  isSet: false,
  item: null,
  isZeroQuantity: false,

  totalInHandItems: Ember.computed('item.quantity', function() {
    return this.get('item.quantity');
  }),

  packagesLoacationQty: Ember.computed.localStorage(),
  setPackagesLoacationQty: Ember.computed.localStorage(),
  totalQty: Ember.computed.localStorage(),
  originalQty: null,

  actions: {
    move_partial_qty(item) {
      var totalQty = 0;
      var allPackagesLocations = item.get('packages_locations');
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
    },

    move_partial_qty_for_set(item) {
      var totalQty = 0;
      var record1 = {};
      var packagesLoacationQty = [];
      if(item.get('isSet')){
        item.get('setItem.items').forEach(record => {
          record.get('packages_locations').getEach('id').forEach(packages_location_id => {
            var value = parseInt(Ember.$(`#${packages_location_id}`)[0].value);
            var packages_location = this.get('store').peekRecord('packages_location', packages_location_id);
            record1['packages_location_id'] = packages_location_id;
            record1['package_id'] = packages_location.get('package_id');
            record1["new_qty"] = value;
            totalQty += value;
            packagesLoacationQty.push(record1);
            record1 = {};
          });
          this.set('setPackagesLoacationQty', packagesLoacationQty);
          this.set("totalQty", totalQty);
          if(this.get('totalQty') === 0){
            this.set("isZeroQuantity", true);
          } else {
            this.transitionToRoute('items.search_location', item.id, { queryParams: { isPartialMove: true , isSet: true}});
          }
        });
      }
    }
  }
});
