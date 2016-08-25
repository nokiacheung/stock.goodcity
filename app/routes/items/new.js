import AuthorizeRoute from './../authorize';
import AjaxPromise from 'stock/utils/ajax-promise';

export default AuthorizeRoute.extend({

  inventoryNumber: "",

  queryParams: {
    codeId: "",
    locationId: "",
    scanLocationName: ""
  },

  model() {
    var _this = this;
    return new AjaxPromise("/inventory_numbers", "POST", this.get('session.authToken'))
      .then(function(data) {
        _this.set("inventoryNumber", data.inventory_number);
      });
  },

  afterModel() {
    this.store.findAll('location', {reload: true});
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('inventoryNumber', this.get('inventoryNumber'));
    controller.set('displayInventoryOptions', false);
    controller.set('autoGenerateInventory', true);
    controller.set('inputInventory', false);
    controller.set('invalidLocation', false);
  }

});
