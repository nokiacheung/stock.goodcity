import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { getOwner } from '@ember/application';
import AjaxPromise from 'stock/utils/ajax-promise';

export default Component.extend({
  store: service(),
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
