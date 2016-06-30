import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Component.extend({
  displayUserPrompt: false,
  displaySetBlock: true,

  store: Ember.inject.service(),

  actions: {
    displayDispatchOverlay() {
      this.set("displayUserPrompt", true);
    },

    dispatchItem() {
      var item = this.get("item");
      var url = `/items/${item.get('id')}/dispatch_stockit_item`;
      this.send("resqustAPI", url);
    },

    undispatchItem() {
      var item = this.get("item");
      var url = `/items/${item.get('id')}/undispatch_stockit_item`;
      this.send("resqustAPI", url);
    },

    resqustAPI(url) {
      var loadingView = getOwner(this).lookup('component:loading').append();

      new AjaxPromise(url, "PUT", this.get('session.authToken'))
        .then(data => {
          this.get("store").pushPayload(data);
        })
        .finally(() => {
          loadingView.destroy();
        });
    }
  }

});
