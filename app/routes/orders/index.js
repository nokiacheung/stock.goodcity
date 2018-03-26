import AuthorizeRoute from './../authorize';
import AjaxPromise from 'stock/utils/ajax-promise';

export default AuthorizeRoute.extend({
  model() {
    return new AjaxPromise("/auth/current_user_profile", "GET", this.session.get("authToken"))
      .then(data => {
        this.store.pushPayload(data);
      });
  }
});
