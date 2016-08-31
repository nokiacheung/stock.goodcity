import AuthorizeRoute from './authorize';

export default AuthorizeRoute.extend({

  model() {
    return this.store.query('location', { recently_used: true });
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('searchText', "");
  }
});
