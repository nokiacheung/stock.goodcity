import OrganisationRoute from './../organisation';

export default OrganisationRoute.extend({
  setupController(controller, model){
    this._super(controller, model);
    controller.set('gcOrganisationUsersCount', this.store.peekAll('organisationsUser').filterBy('organisationId', parseInt(model.id)).length);
  }
});
