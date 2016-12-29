import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Component.extend({
  displayUserPrompt: false,
  store: Ember.inject.service(),
  messageBox: Ember.inject.service(),
  i18n: Ember.inject.service(),
  hideDetailsLink: true,
  selectedOrder: null,
  item: null,
  toggleOverlay: true,
  order: null,
  autoDisplayOverlay: false,

  triggerClick: Ember.observer("autoDisplayOverlay", function() {
    this.send("displayDispatchOverlay");
  }),

  actions: {
    displayDispatchOverlay() {
      this.set("displayUserPrompt", true);
    },

    assignDesignation() {
      var selection = this.get("selectedOrder");
      if(!selection) { return false; }

      if(selection === 'chooseOrder') {
        this.get('router').transitionTo("items.search_order", this.get('item.id'), { queryParams: { isSet: true, showDispatchOverlay: true } });
      } else {
        var order = this.get('store').peekRecord('designation', selection);
        this.set('order', order);
        this.toggleProperty("toggleOverlay");
      }
    },

    dispatchItemSet() {
      var item = this.get("item");
      var order = item.get("designation.id");
      var url = `/items/${item.get('setItem.id')}/dispatch_stockit_item_set`;
      var loadingView = getOwner(this).lookup('component:loading').append();
      var  properties = {
        order_id: order,
        package_id: item.get('id'),
      };

      new AjaxPromise(url, "PUT", this.get('session.authToken'), { package: properties })
        .then(data => {
          this.get("store").pushPayload(data);
        })
        .finally(() => {
          loadingView.destroy();
        });
    },
  }

});
