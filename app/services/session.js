import { notEmpty } from '@ember/object/computed';
import { computed } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import '../computed/local-storage';

export default Service.extend({

  authToken:  computed.localStorage(),
  otpAuthKey: computed.localStorage(),
  language:   computed.localStorage(),
  isLoggedIn: notEmpty("authToken"),
  store:      service(),

  currentUser: computed(function(){
    // TO-DO
    // var store = this.get('store');
    // return store.peekAll('user_profile').get('firstObject') || null;
    return null;
  }).volatile(),

  clear: function() {
    this.set("authToken", null);
    this.set("otpAuthKey", null);
  }
});
