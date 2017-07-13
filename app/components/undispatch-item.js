import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Component.extend({
  store: Ember.inject.service(),
  isUndispatchFromPartialUndesignate: false,

  actions: {
    undispatchItem() {
      var item = this.get("item");
      var pkg = this.get("package");
      this.router.transitionTo('items.search_location', item.get("id"), { queryParams: { isUndispatch: true, ordersPackageId: pkg.get("id") }});
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
    }
  }
});
