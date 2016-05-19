import Ember from 'ember';

export default Ember.Route.extend({

  i18n: Ember.inject.service(),

  beforeModel(transition = []) {
    if (transition.queryParams.ln) {
      var language = transition.queryParams.ln === "zh-tw" ? "zh-tw" : "en";
      this.set('session.language', language);
    }

    Ember.onerror = window.onerror = error => this.handleError(error);
  },

  logger: Ember.inject.service(),
  messageBox: Ember.inject.service(),

  handleError: function(reason) {
    try
    {
      var status;
      try { status = parseInt(reason.errors[0].status); }
      catch (err) { status = reason.status; }

      if (status === 401) {
        if (this.session.get('isLoggedIn')) {
          this.get('messageBox').alert(this.get("i18n").t('must_login'), () => this.send('logMeOut'));
        }
      } else {
        this.get("logger").error(reason);
        this.get("messageBox").alert(this.get("i18n").t("unexpected_error"));
      }

    } catch (err) {}
  },

  actions: {
    error(reason) {
      try {
        this.handleError(reason);
      } catch (err) {}
    },

    logMeOut() {
      this.session.clear();
      this.store.unloadAll();
      this.transitionTo('login');
    },
  }
});
