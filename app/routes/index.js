import SessionRoute from './session';

export default SessionRoute.extend({
  model() {
    var recentlyUsedDesignations = this.get('store').query('designation', { recently_used: true });
    var recentlyUsedLocations = this.get('store').query('location', { recently_used: true });
    this.get('store').pushPayload(recentlyUsedDesignations);
    this.get('store').pushPayload(recentlyUsedLocations);
  }
});
