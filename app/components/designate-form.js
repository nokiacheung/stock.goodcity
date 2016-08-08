import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Component.extend({
  displayUserPrompt: false,
  displayAlertOverlay: false,
  showAllSetItems: false,
  autoDisplayOverlay: false,
  hideDetailsLink: true,

  order: null,
  item: null,
  toggleOverlay: null,
  isSet: null,
  store: Ember.inject.service(),

  overridesDesignation: Ember.computed('item.setItem.designationList.[]', 'order', function() {

    var list = [];
    this.get("item.setItem.items").rejectBy('designation', null).forEach(item => {
      list.push(item.get("designation.code"));
    });
    list.filter((e, i, list) => { i = list.indexOf(e) === i; });

    if(list.length === 0) {
      return false;
    } else {
      var index = list.indexOf(this.get('order.code'));
      if(index > -1) { list.splice(index, 1); }
      return list.length > 0;
    }
  }),

  triggerOrderClick: Ember.observer("order", "toggleOverlay", function() {
    if(this.get("order")) {
      this.send("displayDesignateOverlay");
    }
  }),

  isDesignatedToCurrentOrder: Ember.computed('order', 'item', function() {
    return this.get("order.items").findBy("id", this.get("item.id"));
  }),

  triggerItemClick: Ember.observer("autoDisplayOverlay", function() {
    if(this.get("autoDisplayOverlay")) {
      this.send("displayDesignateOverlay");
    }
  }),

  actions: {
    displayDesignateOverlay() {
      if(this.get("isDesignatedToCurrentOrder")) {
        this.set("displayAlertOverlay", true);
      } else {
        this.set("displayUserPrompt", true);
      }
    },

    designateItem() {
      var order = this.get("order");
      var item = this.get("item");
      var showAllSetItems = this.get("showAllSetItems");
      this.set("showAllSetItems", false);

      var loadingView = getOwner(this).lookup('component:loading').append();
      var url = `/items/${item.get('id')}/designate_stockit_item`;

      new AjaxPromise(url, "PUT", this.get('session.authToken'), { order_id: order.get("id") })
        .then(data => {
          this.get("store").pushPayload(data);
          if(showAllSetItems) {
            this.sendAction("displaySetItems");
          } else {
            this.get('router').transitionTo("orders.detail", order);
          }
        })
        .finally(() => {
          loadingView.destroy();
        });
    }
  }

});
