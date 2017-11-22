import $ from 'jquery';
import { computed } from '@ember/object';
import Controller from '@ember/controller';
import { getOwner } from '@ember/application';
import AjaxPromise from 'stock/utils/ajax-promise';

export default Controller.extend({
  promptUserPopUp: false,
  orderPackage: null,
  total: 0,
  values: 0,
  orderPackagesAndQuantities: null,
  codeAndQuantities: null,
  codes: null,
  partialUndesignateBackLinkpath: computed.localStorage(),

  init() {
    this.set('promptUserPopUp', false);
  },

  actions: {
    getConfirmationPopUp(item) {
      var total = 0;
      var ordersPackages = item.get('orderPackagesMoreThenZeroQty');
      var elementIds = ordersPackages.getEach('id');
      var orderPkgQty = [];
      var oneRecord = {};
      var codeQty = {};
      elementIds.forEach(record => {
        var value = parseInt($(`#${record}`)[0].value, 10);
        var orderPackage = this.get('store').peekRecord('orders_package', record);
        oneRecord["orders_package_id"] = record;
        oneRecord["package_id"] = orderPackage.get('packageId');
        oneRecord["quantity"] = value;
        orderPkgQty.push(oneRecord);
        oneRecord = {};
        codeQty[orderPackage.get('designation.code')] = value;
        total += value;
      });

      this.set('orderPackagesAndQuantities', orderPkgQty);
      this.set('total', total);
      this.set('codeAndQuantities', codeQty);
      this.set('promptUserPopUp', true);
    },

    undesignate_partial_qty(data) {
      var item = data;
      var loadingView = getOwner(this).lookup('component:loading').append();
      var url;

      url = `/items/${data.id}/undesignate_partial_item`;

      new AjaxPromise(url, "PUT", this.get('session.authToken'), { package: this.get('orderPackagesAndQuantities') })
        .then(data => {
          this.get("store").pushPayload(data);
          loadingView.destroy();
          if(!item.get('orderPackagesMoreThenZeroQty.length')) {
            this.replaceRoute('items.index');
          }
        })
        .finally(() => {
          loadingView.destroy();
        });
    },

    dispatch(item, orderPackage){
      this.transitionToRoute('items.partial_dispatch', item.id, { queryParams: { orderPackageId: orderPackage.id }});
    }
  }
});
