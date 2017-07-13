import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  queryParams: ['ordersPackageId'],
  ordersPackageId: null,
  modifyDesignatedQty: false,

  actions: {
    displayUserPrompt() {
      this.set("modifyDesignatedQty", true);
    },

    undesignateItem(ordersPackage) {
      var item = ordersPackage.get("item");
      var data = [];
      var record = {};
      var inputValue = parseInt(Ember.$(`#${ordersPackage.id}`)[0].value, 10);
      record["orders_package_id"] = ordersPackage.get('id');
      record["package_id"] = ordersPackage.get('packageId');
      if(this.get("modifyDesignatedQty")) {
        record["quantity"] = ordersPackage.get("quantity");
      } else {
        record["quantity"] = ordersPackage.get("quantity") - inputValue;
      }
      data.push(record);

      var loadingView = getOwner(this).lookup('component:loading').append();
      var url = `/items/${item.get('id')}/undesignate_partial_item`;

      new AjaxPromise(url, "PUT", this.get('session.authToken'), { package: data })
        .then(data => {
          this.get("store").pushPayload(data);
          data.orders_packages.forEach(pkg => {
            if(pkg.quantity === 0 && pkg.id === parseInt(this.get("ordersPackageId"), 10)) {
              this.set("modifyDesignatedQty", true);
            }
          });
        })
        .finally(() => {
          loadingView.destroy();
          this.set("modifyDesignatedQty", false);
          this.transitionToRoute("items.partial_undesignate", item.get("id"));
        });
    }
  }

});
