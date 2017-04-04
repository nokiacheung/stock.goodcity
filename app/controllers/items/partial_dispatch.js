import Ember from 'ember';
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;


export default Ember.Controller.extend({
  item: null,
  queryParams: ["orderPackageId"],
  orderPackageId: null,
  partialDispatchBackLinkpath: Ember.computed.localStorage(),

  orderPackage: Ember.computed('orderPackageId', function(){
    var orderPackage = this.get('store').peekRecord('OrdersPackage', this.get('orderPackageId'));
    return orderPackage;
  }),

  actions: {
    dispatchQty(item){
      var elementIds  = item.get('packagesLocations').getEach('id');
      var packagesLocationQty = [];
      var record = {};
      var totalQty;
      elementIds.forEach(packages_location_id => {
        if(Ember.$(`#${packages_location_id}`).length){
          var value = parseInt(Ember.$(`#${packages_location_id}`)[0].value);
          record["packages_location_id"] = packages_location_id;
          record["qty_to_deduct"] = value;
          totalQty += value;
          packagesLocationQty.push(record);
          record = {};
        }
      });
      this.set("packagesLocationQty", packagesLocationQty);

      var  properties = {
        order_package_id: this.get('orderPackageId'),
        package_id: item.id,
      };

      var url = `/items/${item.get('id')}/dispatch_stockit_item`;
      var loadingView = getOwner(this).lookup('component:loading').append();

      new AjaxPromise(url, "PUT", this.get('session.authToken'), { package: properties, packages_location_and_qty: packagesLocationQty })
        .then(data => {
          this.get("store").pushPayload(data);
          this.transitionToRoute("items.detail", item);
        })
        .finally(() => {
          loadingView.destroy();
        });
    }
  }
});
