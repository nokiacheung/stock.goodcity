import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Component.extend({
  store: Ember.inject.service(),

  actions: {
    undispatchItem() {
      var item = this.get("item");
      this.get('router').transitionTo('items.search_location', item.id, { queryParams: { isUndispatch: true }});
    },

    resqustAPI(url) {
      var loadingView = getOwner(this).lookup('component:loading').append();

      new AjaxPromise(url, "PUT", this.get('session.authToken'))
        .then(data => {
          this.get("store").pushPayload(data);
        })
        .finally(() => {
          loadingView.destroy();
          this.sendAction("closeList");
        });
    },
  }
});
