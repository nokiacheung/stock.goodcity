import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';
import config from '../../config/environment';
const { getOwner } = Ember;

export default Ember.Controller.extend({
  queryParams: ['codeId', 'locationId', 'scanLocationName', 'caseNumber'],
  codeId: "",
  locationId: "",
  inventoryNumber: "",
  scanLocationName: "",
  displayInventoryOptions: false,
  autoGenerateInventory: true,
  inputInventory: false,
  locationName: Ember.computed.alias('location.displayName'),
  caseNumber: "",

  quantity: 1,
  length: null,
  width: null,
  height: null,
  selectedGrade: { name: "B", id: "B" },
  selectedCondition: { name: "Used", id: "U" },
  invalidLocation: false,
  invalidScanResult: false,
  newUploadedImage: null,

  imageKeys: Ember.computed.localStorage(),

  i18n: Ember.inject.service(),

  locale: function(str){
    return this.get("i18n").t(str);
  },

  setLocation: Ember.observer("scanLocationName", function() {
    var scanInput = this.get("scanLocationName");
    if(scanInput) {
      var results = this.get("store").peekAll("location").filterBy("displayName", scanInput);
      if(results.length > 0) {
        this.set("invalidScanResult", false);
        this.set("location", results.get("firstObject"));
      } else {
        this.set("invalidScanResult", true);
      }
    } else {
      this.set("invalidScanResult", false);
    }
  }),

  validateLocation: Ember.observer('location', function() {
    if(!this.get("location")) {
      this.set("invalidLocation", false);
    }
  }),

  isMobileApp: config.cordova.enabled,
  messageBox: Ember.inject.service(),

  conditions: Ember.computed(function(){
    return [
      { name: "New", id: "N" },
      { name: "Mixed", id: "M" },
      { name: "Used", id: "U" },
      { name: "Broken", id: "B" }
    ];
  }),

  grades: Ember.computed(function(){
    return [
      { name: "A", id: "A" },
      { name: "B", id: "B" },
      { name: "C", id: "C" },
      { name: "D", id: "D" }
    ];
  }),

  description: Ember.computed("code", {
    get() {
      return this.get("code.name");
    },
    set(key, value) {
      return value;
    }
  }),

  parentCodeName: Ember.computed("codeId", function() {
    var selected = this.get("store").peekRecord("code", this.get("codeId"));
    return selected && selected.get("name");
  }),

  code: Ember.computed("codeId", function() {
    var selected = this.get("store").peekRecord("code", this.get("codeId"));
    return selected && selected.defaultChildPackagesList()[0];
  }),

  location: Ember.computed("codeId", "locationId", {
    get() {
      var locationId = this.get("locationId");
      if(locationId) { this.set("scanLocationName", null); }
      var location = this.get("store").peekRecord("location", locationId) || this.get("code.location");
      if(!locationId && location) { this.set("locationId", location.get("id")); }
      return location;
    },
    set(key, value) {
      return value;
    }
  }),

  initActionSheet: function(onSuccess) {
    return window.plugins.actionsheet.show({
      buttonLabels: [this.locale("edit_images.upload").string, this.locale("edit_images.camera").string, this.locale("edit_images.cancel").string]
    }, function(buttonIndex) {
      if (buttonIndex === 1) {
        navigator.camera.getPicture(onSuccess, null, {
          quality: 40,
          destinationType: navigator.camera.DestinationType.DATA_URL,
          sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        });
      }
      if (buttonIndex === 2) {
        navigator.camera.getPicture(onSuccess, null, {
          correctOrientation: true,
          quality: 40,
          destinationType: navigator.camera.DestinationType.DATA_URL,
          sourceType: navigator.camera.PictureSourceType.CAMERA
        });
      }
      if (buttonIndex === 3) {
        window.plugins.actionsheet.hide();
      }
    });
  },

  actions: {

    //file upload
    triggerUpload() {

      // For Cordova application
      if (config.cordova.enabled) {
        var onSuccess = ((function() {
          return function(path) {
            console.log(path);
            var dataURL = "data:image/jpg;base64," + path;

            Ember.$("input[type='file']").fileupload('option', 'formData').file = dataURL;
            Ember.$("input[type='file']").fileupload('add', { files: [ dataURL ] });
          };
        })(this));

        this.initActionSheet(onSuccess);
      } else {

        // For web application
        if(navigator.userAgent.match(/iemobile/i))
        {
          //don't know why but on windows phone need to click twice in quick succession
          //for dialog to appear
          Ember.$("input[type='file']").click().click();
        }
        else
        {
          Ember.$("input[type='file']").trigger("click");
        }
      }
    },

    uploadReady() {
      this.set("isReady", true);
    },

    uploadStart(e, data) {
      this.set("uploadedFileDate", data);
      Ember.$(".loading-image-indicator").show();
      this.set("loadingPercentage", "Image Uploading ");
    },

    cancelUpload() {
      if(this.get("uploadedFileDate")){ this.get("uploadedFileDate").abort(); }
    },

    uploadProgress(e, data) {
      e.target.disabled = true; // disable image-selection
      var progress = parseInt(data.loaded / data.total * 100, 10) || 0;
      this.set("addPhotoLabel", progress + "%");
      this.set("loadingPercentage", "Image Uploading " + progress + "%");
    },

    uploadComplete(e) {
      e.target.disabled = false; // enable image-selection
      this.set("uploadedFileDate", null);
      Ember.$(".loading-image-indicator.hide_image_loading").hide();
      this.set("loadingPercentage", "Image Uploading ");
    },

    uploadSuccess(e, data) {
      var identifier = data.result.version + "/" + data.result.public_id + "." + data.result.format;
      var newUploadedImage = this.get("store").createRecord("image", {
        cloudinaryId: identifier,
        favourite: true
      });
      this.set("newUploadedImage", newUploadedImage);
      this.set("imageKeys", identifier);
    },

    clearDescription() {
      this.set("description", "");
    },

    deleteAutoGeneratedNumber() {
      new AjaxPromise("/inventory_numbers/remove_number", "PUT", this.get('session.authToken'), { code: this.get('inventoryNumber') });
    },

    deleteUnusedImage() {
      if(this.get('imageKeys.length')) {
        new AjaxPromise("/images/delete_cloudinary_image", "PUT", this.get('session.authToken'), { cloudinary_id: this.get('imageKeys') });
        this.set("imageKeys", "");
      }
    },

    cancelForm() {

      this.get("messageBox").custom(
        "You will lose all your data. Are you sure you want to cancel this item?",
        "Yes",
        () => {
          if(this.get("autoGenerateInventory")) {
            this.send("deleteAutoGeneratedNumber");
          }
          this.send("deleteUnusedImage");
          this.set("locationId", "");
          this.set("codeId", "");
          this.transitionToRoute("index");
        },
        "No");
    },

    toggleInventoryOptions() {
      this.toggleProperty("displayInventoryOptions");
    },

    editInventoryNumber() {
      this.send("deleteAutoGeneratedNumber");
      this.set("inventoryNumber", "");
      this.set("inputInventory", true);
      this.set("autoGenerateInventory", false);
      this.set("displayInventoryOptions", false);
    },

    autoGenerateInventoryNumber() {
      var _this = this;
      this.set("inventoryNumber", "");
      this.set("inputInventory", false);
      this.set("autoGenerateInventory", true);
      this.set("displayInventoryOptions", false);

      new AjaxPromise("/inventory_numbers", "POST", this.get('session.authToken'))
      .then(function(data) {
        _this.set("inventoryNumber", data.inventory_number);
      });
    },

    scanInventoryNumber() {
      this.set("displayInventoryOptions", false);
      this.set("autoGenerateInventory", false);
      this.set("inputInventory", false);
      this.send("deleteAutoGeneratedNumber");

      var _this = this;
      var onSuccess = res => {
        if (!res.cancelled) {
          _this.set("inventoryNumber", res.text);
        }
      };
      var onError = error => this.get("messageBox").alert("Scanning failed: " + error);
      var options = {"formats": "CODE_128"};
      window.cordova.plugins.barcodeScanner.scan(onSuccess, onError, options);
    },

    saveItem() {
      var _this = this, loadingView;
      if(
        _this.get("quantity").toString().trim().length === 0 ||
        _this.get("description").trim().length === 0 ||
        !_this.get("location") ||
        _this.get("inventoryNumber").trim().length === 0 ||
        !_this.get('code') ||
        parseInt(_this.get("length")) === 0 ||
        parseInt(_this.get("width")) === 0 ||
        parseInt(_this.get("height")) === 0
      ) {
        if(!_this.get("location")) { this.set("invalidLocation", true); }
        return false;
      } else {

        loadingView = getOwner(this).lookup('component:loading').append();
        var properties = {
          quantity: _this.get("quantity"),
          length: _this.get("length"),
          width: _this.get("width"),
          height: _this.get("height"),
          inventory_number: _this.get("inventoryNumber"),
          case_number: _this.get("caseNumber"),
          notes: _this.get("description"),
          grade: _this.get("selectedGrade.id"),
          donor_condition_id: _this.get("selectedCondition.id"),
          location_id: _this.get("location.id"),
          package_type_id: _this.get("code.id"),
          state_event: 'mark_received'
        };

        new AjaxPromise("/packages", "POST", this.get('session.authToken'), { package: properties })
          .then(data => {
            this.get("store").pushPayload(data);
            var image = this.get("newUploadedImage");
            image.setProperties({
              imageableId: data.item.id,
              imageableType: "Package"
            });
            image.save();
            this.set("imageKeys", "");
            loadingView.destroy();
            _this.transitionToRoute("items.detail", data.item.id);
          })
          .catch(response => {
            loadingView.destroy();
            _this.get("messageBox").alert(response.responseJSON.errors[0]);
          });

      }
    }

  }

});
