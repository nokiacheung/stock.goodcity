import AuthorizeRoute from './authorize';

export default AuthorizeRoute.extend({

  model() {
    var recentlyUsedLocations = this.store.peekAll('location').filterBy('recentlyUsedAt');
    return recentlyUsedLocations!==0?recentlyUsedLocations :this.store.query('location', { recently_used: true });
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('searchText', "");
  }
});
