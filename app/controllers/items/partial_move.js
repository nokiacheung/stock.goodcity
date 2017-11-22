import $ from 'jquery';
import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
  item: null,
  isZeroQuantity: false,
  packagesLocationQty: computed.localStorage(),
  totalQty: computed.localStorage(),
  originalQty: null,
  isEditing: false,

  actions: {
    move_partial_qty(item) {
      var totalQty = 0;
      var allPackagesLocations = item.get('packagesLocations');
      var elementIds  = allPackagesLocations.getEach('id');
      var packagesLocationQty = [];
      var record = {};
      elementIds.forEach(packages_location_id => {
        if($(`#${packages_location_id}`).length){
          var value = parseInt($(`#${packages_location_id}`)[0].value, 10);
          var packages_location = this.get('store').peekRecord('packages_location', packages_location_id);
          record["packages_location_id"] = packages_location_id;
          record["location_id"] = packages_location.get('locationId');
          record["package_id"] = packages_location.get('packageId');
          record["new_qty"] = value;
          totalQty += value;
          packagesLocationQty.push(record);
          record = {};
        }
      });
      this.set("packagesLocationQty", packagesLocationQty);
      this.set("totalQty", totalQty);
      if(this.get('totalQty') === 0){
        this.set("isZeroQuantity", true);
      }else{
        this.transitionToRoute('items.search_location', item.id, { queryParams: { isPartialMove: true }});
      }
    },
    editPackagesLocation(packagesLocation){
      this.set('isEditing', true);
      packagesLocation.set('isEditing', true);
    },

    notNow(item){
      var editedPackageLocations = item.get('packagesLocations').filterBy('isEditing', true);
      editedPackageLocations.forEach(packageLocation => {
        $(`#packages-qty-location-${packageLocation.id}`)[0].innerText = packageLocation.get('quantity');
      });
      editedPackageLocations.setEach('isEditing', false);
      this.set('isEditing', false);
    }
  }
});
