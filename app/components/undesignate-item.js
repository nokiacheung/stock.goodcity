import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Component.extend({
  displayUserPrompt: false,
  store: Ember.inject.service(),
  hideDetailsLink: true,
  item: null,
  orderPackage: null,
  package: null,

  actions: {
    displayDesignateOverlay() {
      this.set("displayUserPrompt", true);
    },

    undesignateItem() {
      var item = this.get("item");
      var orderPackage = this.get("package");
      var record = {};
      record["orders_package_id"] = orderPackage.get('id');
      record["package_id"] = orderPackage.get('packageId');
      record["quantity"] = orderPackage.get('quantity');
      record["order_id"] = orderPackage.get('orderId');

      var loadingView = getOwner(this).lookup('component:loading').append();
      var url = `/items/${item.get('id')}/undesignate_partial_item`;

      new AjaxPromise(url, "PUT", this.get('session.authToken'), { package: record })
        .then(data => {
          this.get("store").pushPayload(data);
        })
        .finally(() => {
          loadingView.destroy();
          this.sendAction("closeList");
        });
    },

    closeItemOptions() {
      this.sendAction("closeList");
    }
  }
});
