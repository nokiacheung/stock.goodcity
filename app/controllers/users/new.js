import config from '../../config/environment';
import Ember from "ember";
const { getOwner } = Ember;
import AjaxPromise from 'stock/utils/ajax-promise';

export default Ember.Controller.extend({

  organisationId: Ember.computed.alias("model.id"),

  actions: {
    saveUser() {
      var loadingView = getOwner(this).lookup('component:loading').append();
      var mobilePhone = config.APP.HK_COUNTRY_CODE + this.get('mobilePhone');
      var firstName = this.get('firstName');
      var lastName = this.get('lastName');
      var organisationId = this.get('organisationId');
      new AjaxPromise("/organisations_users", "POST", this.get('session.authToken'), { oranisations_users: { firstName: firstName,
        organisationId: organisationId}}).then(data =>{
      });
    },
    clearDescription(){

    }
  }
});
