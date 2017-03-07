import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Component.extend({

  displayUserPrompt: false,
  store: Ember.inject.service(),

  item: null,
  published: Ember.computed.alias("item.allowWebPublish"),

  actions: {
    displayPublishOverlay() {
      this.set("displayUserPrompt", true);
    },

    setPublishStatus() {
      var item = this.get("item");
      var loadingView = getOwner(this).lookup('component:loading').append();
      var url = `/packages/${item.get('id')}`;

      new AjaxPromise(url, "PUT", this.get('session.authToken'), { package: { allow_web_publish: item.toggleProperty("allowWebPublish") } })
        .then(data => {
          this.get("store").pushPayload(data);
        })
        .finally(() => {
          loadingView.destroy();
        });
    },
  }

});
