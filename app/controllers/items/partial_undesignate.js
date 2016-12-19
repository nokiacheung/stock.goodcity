import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Controller.extend({
  promptUserPopUp: false,
  ordersPackage: null,
  partial_qty_value: 0,

  actions: {
    getConfirmationPopUp(data) {
      var elmnt = Ember.$(`#${data.id}`)[0];
      var value = parseInt(elmnt.value);
      this.set('partial_qty_value', value);
      this.set('promptUserPopUp', true);
      this.set('ordersPackage', data);
    },

    undesignate_partial_qty(data) {
      var elmnt = Ember.$(`#${data.id}`)[0];
      var value = parseInt(elmnt.value);

      var properties = {
        orders_package_id: data.get("id"),
        package_id: data.get('packageId'),
        quantity: value,
      };

      var loadingView = getOwner(this).lookup('component:loading').append();
      var url;

      url = `/items/${data.get('packageId')}/undesignate_partial_item`;

      new AjaxPromise(url, "PUT", this.get('session.authToken'), { package: properties })
        .then(data => {
          this.get("store").pushPayload(data);
          loadingView.destroy();
        })
        .finally(() => {
          loadingView.destroy();
        });
    },
  }
});
