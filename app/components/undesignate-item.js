import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { getOwner } from '@ember/application';
import AjaxPromise from 'stock/utils/ajax-promise';

export default Component.extend({
  displayUserPrompt: false,
  store: service(),
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
      var data = [];
      var record = {};
      record["orders_package_id"] = orderPackage.get('id');
      record["package_id"] = orderPackage.get('packageId');
      record["quantity"] = orderPackage.get('quantity');
      data.push(record);

      var loadingView = getOwner(this).lookup('component:loading').append();
      var url = `/items/${item.get('id')}/undesignate_partial_item`;

      new AjaxPromise(url, "PUT", this.get('session.authToken'), { package: data })
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
