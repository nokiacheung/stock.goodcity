import Ember from 'ember';
import AjaxPromise from '../utils/ajax-promise';

export default Ember.Mixin.create({
  preloadData: function() {

    if (this.get("session.authToken")) {
      new AjaxPromise("/auth/current_user_profile", "GET", this.session.get("authToken"))
        .then(data => {
          this.store.pushPayload(data);
          this.store.pushPayload({ user: data.user_profile });
          this.notifyPropertyChange("session.currentUser");
        }
      );
    }
  }
});
