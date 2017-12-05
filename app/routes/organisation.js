import AuthorizeRoute from './authorize';

export default AuthorizeRoute.extend({
  model(params) {
    return this.store.findRecord("organisation", params.organisation_id, { reload: true });
  },
});
