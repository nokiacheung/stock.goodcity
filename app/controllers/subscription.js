import Ember from "ember";
import config from "../config/environment";

function run(func) {
  if (func) {
    func();
  }
}

export default Ember.Controller.extend({
  socket: null,
  lastOnline: Date.now(),
  deviceTtl: 0,
  deviceId: Math.random().toString().substring(2),
  modelDataTypes: ["offer", "Offer", "item", "Item", "Schedule", "schedule", "delivery", "Delivery"],
  // logger: Ember.inject.service(),
  status: {
    online: false
  },

  updateStatus: Ember.observer('socket', function () {
    var socket = this.get("socket");
    var online = navigator.connection ? navigator.connection.type !== "none" : navigator.onLine;
    online = socket && socket.connected && online;
    this.set("status", {"online": online});
  }),

  // resync if offline longer than deviceTtl
  checkdeviceTtl: Ember.observer('status.online', function () {
    var online = this.get("status.online");
    var deviceTtl = this.get("deviceTtl");
    if (online && deviceTtl !== 0 && (Date.now() - this.get("lastOnline")) > deviceTtl * 1000) {
      this.resync();
    } else if (online === false) {
      this.set("lastOnline", Date.now());
    }
  }),

  initController: Ember.on('init', function() {
    var updateStatus = Ember.run.bind(this, this.updateStatus);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
  }),

  actions: {
    wire() {
      var updateStatus = Ember.run.bind(this, this.updateStatus);
      var connectUrl = config.APP.SOCKETIO_WEBSERVICE_URL +
        "?token=" + encodeURIComponent(this.session.get("authToken")) +
        "&deviceId=" + this.get("deviceId") +
        "&meta=appName:" + config.APP.NAME;
        // pass mutilple meta values by seperating '|' like this
        // "&meta=appName:" + config.APP.NAME +"|version:" + config.APP.NAME;

      var socket = io(connectUrl, {autoConnect:false,forceNew:true});
      this.set("socket", socket);
      socket.on("connect", function() {
        updateStatus();
        socket.io.engine.on("upgrade", updateStatus);
      });
      socket.on("disconnect", updateStatus);
      socket.on("error", Ember.run.bind(this, function(reason) {
        // ignore xhr post error related to no internet connection
        if (typeof reason !== "object" || reason.type !== "TransportError" && reason.message !== "xhr post error") {
          // this.get("logger").error(reason);
        }
      }));

      socket.on("update_store", Ember.run.bind(this, this.update_store));
      socket.on("_batch", Ember.run.bind(this, this.batch));
      socket.on("_resync", Ember.run.bind(this, this.resync));
      socket.on("_settings", Ember.run.bind(this, function(settings) {
        this.set("deviceTtl", settings.device_ttl);
        this.set("lastOnline", Date.now());
      }));
      socket.connect(); // manually connect since it's not auto-connecting if you logout and then back in
    },
  },

  batch: function(events, success) {
    events.forEach(function(args) {
      var event = args[0];
      this[event].apply(this, args.slice(1));
    }, this);

    run(success);
  },

  resync: function() {
    this.get("store").findAll("item");
  },

  // each action below is an event in a channel
  update_store: function(data, success) {

    var type = Object.keys(data.item)[0];
    var item = Ember.$.extend({}, data.item[type]);
    //Don't update data store for Offer/Item/schedule/delivery updates
    this.get("modelDataTypes").forEach(modelDataType => {
      if(modelDataType === type) {
        return false;
      }
    });
    if(type === "package" || type === "Package") {
      //Changing type as we've Item model instead of Package
      type = "item";
      delete item.offer_id;
      //Removing null for empty packages_location_id arrays
      item.packages_location_ids = item.packages_location_ids.compact();

      //Don't update Data-store if Item has 0 qty and no designation
      if(!item.designation_id && !item.quantity) {
        return false;
      }
      this.store.query("orders_package", { all_orders_packages: item.id });
      //Deleting ids in case of null
      if(!item.orders_package_ids.length) {
        delete item.orders_package_ids;
      }
      if(!item.designation_id) {
        delete item.designation_id;
      }
      if(!item.item_id) {
        delete item.item_id;
      }
    }

    this.store.normalize(type, item);

    var existingItem = this.store.peekRecord(type, item.id);
    var hasNewItemSaving = this.store.peekAll(type).any(function(o) { return o.id === null && o.get("isSaving"); });
    var existingItemIsSaving = existingItem && existingItem.get("isSaving");
    if (data.operation === "create" && hasNewItemSaving || existingItemIsSaving) {
      run(success);
      return;
    }

    if (["create","update"].contains(data.operation)) {
        var payload = {};
        payload[type] = item;
        this.store.pushPayload(payload);
    } else if (existingItem) { //delete
      this.store.unloadRecord(existingItem);
    }
    run(success);
  }
});
