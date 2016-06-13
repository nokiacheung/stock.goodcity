import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Component.extend({

  store: Ember.inject.service(),

  actions: {
    displayDesignateForm() {
      this.set("displayUserPrompt", true);
    },

    designateItem() {
      var order = this.get("order");
      var item = this.get("item");

      var loadingView = getOwner(this).lookup('component:loading').append();
      var url = `/items/${item.get('id')}/designate_stockit_item`;

      new AjaxPromise(url, "PUT", this.get('session.authToken'), { order_id: order.get("id") })
        .then(data => {
          this.get("store").pushPayload(data);
          this.get('router').transitionTo("orders.detail", order);
        })
        .finally(() => {
          loadingView.destroy();
        });
    }
  }

});
