import Ember from 'ember';
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;


export default Ember.Controller.extend({
  item: null,
  queryParams: ["orderPackageId"],
  orderPackageId: null,
  partialDispatchBackLinkpath: Ember.computed.localStorage(),
  messageBox: Ember.inject.service(),
  store: Ember.inject.service(),

  orderPackage: Ember.computed('orderPackageId', function(){
    return this.get('store').peekRecord('OrdersPackage', this.get('orderPackageId'));
  }),

  actions: {
    dispatchQty(item){
      var elementIds  = item.get('packagesLocations').getEach('id');
      var packagesLocationQty = [];
      var record = {};
      var totalQty;
      elementIds.forEach(packages_location_id => {
        if(Ember.$(`#${packages_location_id}`).length){
          var value = parseInt(Ember.$(`#${packages_location_id}`)[0].value, 10);
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
        package_id: item.id
      };

      var url = `/items/${item.get('id')}/dispatch_stockit_item`;
      var loadingView = getOwner(this).lookup('component:loading').append();

      new AjaxPromise(url, "PUT", this.get('session.authToken'), { package: properties, packages_location_and_qty: packagesLocationQty })
        .then(data => {
          this.get("store").pushPayload(data);
          this.transitionToRoute("items.detail", item);
        }).catch(error => {
          this.get("messageBox").alert(error.responseJSON.errors,
            () => {
              this.get('store').findRecord('item', item.id);
              this.transitionToRoute("items.detail", item.id);
            });
        }).finally(() => {
          loadingView.destroy();
        });
    }
  }
});
