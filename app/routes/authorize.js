import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  messageBox: service(),
  i18n: service(),

  beforeModel(transition) {
    if (!this.session.get('isLoggedIn')) {
      transition.abort();
      this.get('messageBox').alert(this.get("i18n").t('must_login'), () => {
        var loginController = this.controllerFor('login');
        loginController.set('attemptedTransition', transition);
        this.transitionTo('login');
      });
      return false;
    }
  }
});
