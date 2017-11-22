import $ from 'jquery';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import SearchCode from '../search_code';
import AjaxPromise from 'stock/utils/ajax-promise';

export default SearchCode.extend({
  item: null,
  inlineDescription: true,
  store: service(),

  allPackageTypes: computed("fetchMoreResult", 'item.isSet', function(){
    if(this.get('item.isSet')) {
      return this.get('item.setItem.code').allChildPackagesList();
    } else {
      return this.store.query('code', { stock: true });
    }
  }),

  actions: {
    cancelSearch() {
      $("#searchText").blur();
      this.send("clearSearch", true);
      this.transitionToRoute("items.detail", this.get('item'));
    },

    assignItemLabel(type){
      var item = this.get("item");
      var url = `/packages/${item.get('id')}`;
      var key = 'package_type_id';
      var packageParams = {};
      packageParams[key] = type.get('id');

      var loadingView = getOwner(this).lookup('component:loading').append();
      new AjaxPromise(url, "PUT", this.get('session.authToken'), { package: packageParams })
        .then(data => {
          this.get("store").pushPayload(data);
        })
        .finally(() => {
          loadingView.destroy();
        });
      this.transitionToRoute("items.detail", item);
    }
  }
});
