import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Controller.extend({
  queryParams: ['orderId', 'packageTypeId'],
  packageTypeId: null,
  orderId: null,
  quantity: 1,
  messageBox: Ember.inject.service(),

  description: Ember.computed("parentCodeName", {
    get() {
      return this.get("parentCodeName");
    },
    set(key, value) {
      return value;
    }
  }),

  parentCodeName: Ember.computed("packageTypeId", function() {
    var selected = "";
    var codeId = this.get("packageTypeId");
    if(codeId.length) {
      selected = this.get("store").peekRecord("code", codeId);
      return selected && selected.get("name");
    }
    return selected;
  }),

  actions: {
    clearDescription() {
      this.set("description", "");
    },

    saveRequest() {
      if(!window.navigator.onLine){
        this.get("messageBox").alert(this.get("i18n").t("offline_error"));
        return false;
      }
      var _this = this, loadingView;
      if(_this.get("quantity").toString().trim().length === 0) {
        return false;
      } else {
        loadingView = getOwner(this).lookup('component:loading').append();
        var quantity = _this.get("quantity");
        var description = _this.get("description");
        var params = {
          quantity: quantity,
          description: description,
          package_type_id: _this.get("packageTypeId"),
          order_id: _this.get("orderId")
        };

        new AjaxPromise("/goodcity_requests", "POST", this.get('session.authToken'), { goodcity_request: params })
          .then(data => {
            this.get("store").pushPayload(data);
          })
          .catch(response => {
            _this.get("messageBox").alert(response.responseJSON.errors[0]);
          })
          .finally(() => {
            this.transitionToRoute('orders.requested_items', this.get("orderId"));
            loadingView.destroy();
          });
      }
    },

    cancelRequest() {
      this.get("messageBox").custom(
        "Are you sure you want to cancel this request?",
        "Yes",
        () => {
          this.transitionToRoute("orders.requested_items", this.get("orderId"));
        },
        "No");
    },
  }
});
