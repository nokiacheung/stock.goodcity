import Ember from "ember";
import config from '../config/environment';
import AjaxPromise from '../utils/ajax-promise';

export default Ember.Service.extend({
  session: Ember.inject.service(),
  isAndroid() {
    if (!config.cordova.enabled || !window.device) { return; }
    return ["android", "Android", "amazon-fireos"].indexOf(window.device.platform) >= 0;
  },

  isIOS() {
    if (!config.cordova.enabled || !window.device) { return; }
    return window.device.platform === "iOS";
  },

  appLoad() {
    console.log("Init Message");
    if (!config.cordova.enabled) { return; }
    this.initiatePushNotifications();
  },

  initiatePushNotifications() {

    var _this = this;

    function onDeviceReady() {
      var push = PushNotification.init({
        android: {
          senderID: "535052654081",
          badge: false,
          icon: "ic_notify"
        },
        ios: {
          alert: true,
          sound: true
        },
        windows: {}
      });

      push.on("registration", function(data){
          console.log("Push Notification Registration");
          console.log(data.registrationId);
          sendToken(data.registrationId, platformCode());
      });

      push.on("notification", function(data){
        console.log("Push Notification executed");
      });

      push.on('error', function(err){
        debugger;
      });
    }

    function sendToken(handle, platform) {
      return new AjaxPromise("/auth/register_device", "POST", _this.get("session.authToken"), { handle: handle, platform: platform });
    }

    function platformCode() {
      var platform;
      if (_this.isAndroid()) { platform = "gcm"; } else if (window.device.platform === "iOS") { platform = "aps"; } else if (window.device.platform === "windows") { platform = "wns"; }
      return platform;
    }

    document.addEventListener('deviceready', onDeviceReady, true);
  }
});
