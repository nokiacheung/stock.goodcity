import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Component.extend({
  displayUserPrompt: false,
  displayAlertOverlay: false,
  showAllSetItems: false,
  autoDisplayOverlay: false,
  hideDetailsLink: true,
  showDispatchOverlay: false,
  partial_quantity: 0,
  messageBox: Ember.inject.service(),
  partiallyDesignatedPopUp: false,
  partialDesignatedConfirmationPopUp: false,
  totalPartialDesignatedItems: 0,
  cannotDesignateToSameOrder: false,

  order: null,
  item: null,
  toggleOverlay: null,
  isSet: null,
  store: Ember.inject.service(),
  i18n: Ember.inject.service(),
  designatedOnce: true,
  alreadyPartiallyDesignated: false,
  orderPackageId: null,
  alreadyShown: true,

  overridesDesignation: Ember.computed('item.setItem.designationList.[]', 'order', function() {

    if(this.get("item.isSet")) {
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
    } else {
      return false;
    }
  }),

  triggerOrderClick: Ember.observer("order", "toggleOverlay", function() {
    this.set('partial_quantity', getOwner(this).lookup('controller:items.search_order').get('partial_qty'));
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

  isDesignatedToCurrentPartialOrder: Ember.computed('order', 'item', function() {
    var total = 0;
    this.set('partiallyDesignatedPopUp', false);
    this.set('partialDesignatedConfirmationPopUp', false);
    this.set('cannotDesignateToSameOrder', false);
    this.set('alreadyPartiallyDesignated', false);
    var order = this.get('order');
    var item = this.get('item');
    this.get('store').peekAll("orders_package").filterBy("itemId", parseInt(item.id)).forEach(record => {
      if(record.get('itemId') === parseInt(item.id) && record.get('designationId') === parseInt(order.id)) {
          total += record.get('quantity');
          this.set('alreadyPartiallyDesignated', true);
          this.set('orderPackageId', record.get('id'));
        }
      });
    this.set('totalPartialDesignatedItems', total);
    return this.get('alreadyPartiallyDesignated');
  }),

  actions: {
    displayDesignateOverlay() {
      // if(this.get('isDesignatedToCurrentPartialOrder') && getOwner(this).lookup('controller:items.search_order').get('notPartialRoute')) {
      //   this.get('messageBox').alert(this.get("i18n").t('designate.cannot_designate'));
      //   return false;
      // }
      this.set('partiallyDesignatedPopUp', false);
      this.set('partialDesignatedConfirmationPopUp', false);
      this.set('cannotDesignateToSameOrder', false);

      if(this.get('isDesignatedToCurrentPartialOrder') && getOwner(this).lookup('controller:items.search_order').get('notPartialRoute'))
      {
        this.set('cannotDesignateToSameOrder', true);
        return false;
      }

      if(this.get("isDesignatedToCurrentOrder") && !this.get("isSet")) {
        this.set("displayAlertOverlay", true);
      } else if(this.get('isDesignatedToCurrentPartialOrder') && this.get('partial_quantity')) {
        if(this.get('designatedOnce')) {
          this.set('partiallyDesignatedPopUp', true);
          return true;
        }
      } else if (this.get('partial_quantity')) {
        if(this.get('designatedOnce')) {
          this.set('partialDesignatedConfirmationPopUp', true);
          return true;
        }
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
      var url;

      if(this.get("isSet")) {
        url = `/items/${item.get('setItem.id')}/designate_stockit_item_set`;
      } else {
        url = `/items/${item.get('id')}/designate_stockit_item`;
      }

      new AjaxPromise(url, "PUT", this.get('session.authToken'), { order_id: order.get("id") })
        .then(data => {
          this.get("store").pushPayload(data);
          if(this.get("isSet")) {
            this.get('router').transitionTo("items.detail", item, { queryParams: { showDispatchOverlay: this.get('showDispatchOverlay') }});
          } else if(showAllSetItems) {
            this.sendAction("displaySetItems");
          } else {
            this.get('router').transitionTo("orders.detail", order);
          }
        })
        .finally(() => {
          loadingView.destroy();
        });

    },

    designatePartialItem() {
      this.set('designatedOnce', false);
      var order = this.get("order");
      var item = this.get("item");
      var showAllSetItems = this.get("showAllSetItems");
      this.set("showAllSetItems", false);
      var isSameDesignation = this.get('partial_quantity') && this.get('isDesignatedToCurrentPartialOrder');

      var properties = {
        order_id: order.get("id"),
        package_id: item.get('id'),
        quantity: this.get('partial_quantity'),
      };

      if(isSameDesignation) {
        properties.operation = "update";
        properties.orders_package_id = this.get('orderPackageId');
      }

      var loadingView = getOwner(this).lookup('component:loading').append();
      var url;

      // if(this.get("isSet")) {
      //   url = `/items/${item.get('setItem.id')}/designate_stockit_item_set`;
      // }
      if(isSameDesignation) {
        url = `/items/${item.get('id')}/update_partial_quantity_of_same_designation`;
      } else {
        url = `/items/${item.get('id')}/designate_partial_item`;
      }

      new AjaxPromise(url, "PUT", this.get('session.authToken'), { package: properties })
        .then(data => {
          this.get("store").pushPayload(data);
          if(this.get("isSet")) {
            this.get('router').transitionTo("items.detail", item, { queryParams: { showDispatchOverlay: this.get('showDispatchOverlay') }});
          } else if(showAllSetItems) {
            this.sendAction("displaySetItems");
          } else {
            loadingView.destroy();
            this.get('router').transitionTo("items.index");
          }
        })
        .finally(() => {
          loadingView.destroy();
        });
    }
  }

});
