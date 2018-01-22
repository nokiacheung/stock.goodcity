import Ember from 'ember';
import AjaxPromise from '../utils/ajax-promise';

export default Ember.Mixin.create({
  preloadData: function() {
    var promises = [];

    if (this.get("session.authToken")) {
      promises.push(
        new AjaxPromise("/auth/current_user_profile", "GET", this.session.get("authToken"))
          .then(data => {
            this.store.pushPayload(data);
            this.store.pushPayload({ user: data.user_profile });
            this.notifyPropertyChange("session.currentUser");
          })
      );
    }
    return Ember.RSVP.all(promises);
  }
});
