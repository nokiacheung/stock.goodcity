import getOrderRoute from './get_order';

export default getOrderRoute.extend({

  setupController(controller, model){
    this._super(controller, model);
    controller.set('displayAllItems', model.get('items.length') <= 3);
  }
});
