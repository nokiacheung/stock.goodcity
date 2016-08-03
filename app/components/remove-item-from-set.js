import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Component.extend({
  displayUserPrompt: false,
  store: Ember.inject.service(),
  hideDetailsLink: true,

  actions: {
    displayRemoveOverlay() {
      this.set("displayUserPrompt", true);
    },

    removeItemFromSet() {
      var item = this.get("item");
      var loadingView = getOwner(this).lookup('component:loading').append();
      var url = `/items/${item.get('id')}/remove_from_set`;

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
