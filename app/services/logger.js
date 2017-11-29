import Ember from "ember";
import config from "../config/environment";

export default Ember.Service.extend({
  session: Ember.inject.service(),
  rollbar: Ember.inject.service(),

  notifyAirBrake: function(reason) {

    var userName = this.get("session.currentUser.fullName");
    var currentUser = this.get("session.currentUser");
    var userId = this.get("session.currentUser.id");
    var error = reason instanceof Error || typeof reason !== "object" ?
        reason : JSON.stringify(reason);
    var environment = config.staging ? "staging" : config.environment;
    var version = `${config.APP.SHA}`;

    var airbrake = new airbrakeJs.Client({
      projectId: config.APP.AIRBRAKE_PROJECT_ID,
      projectKey: config.APP.AIRBRAKE_PROJECT_KEY
    });
    airbrake.setHost(config.APP.AIRBRAKE_HOST);
    airbrake.notify({ error, context: { userId, userName, environment, version } });
    this.set('rollbar.currentUser', currentUser);
    this.get('rollbar').error(error, data = { id: userId, username: userName, environment: environment});
  },

  error: function(reason) {
    if (reason.status === 0) {
      return;
    }
    console.info(reason);
    if (config.environment === "production" || config.staging) {
      this.notifyAirBrake(reason);
    }
  }
});
