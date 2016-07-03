import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Component.extend({
  displayUserPrompt: false,
  store: Ember.inject.service(),

  actions: {
    displayDesignateOverlay() {
      this.set("displayUserPrompt", true);
    },

    undesignateItem() {
      var item = this.get("item");
      var loadingView = getOwner(this).lookup('component:loading').append();
      var url = `/items/${item.get('id')}/undesignate_stockit_item`;

      new AjaxPromise(url, "PUT", this.get('session.authToken'))
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
