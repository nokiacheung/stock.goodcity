import Ember from "ember";
import config from '../../config/environment';
import searchModule from "../search_module";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default searchModule.extend({

  queryParams: ['searchInput', 'isSet', 'isUndispatch', 'isPartialMove'],
  isSet: false,
  isMobileApp: config.cordova.enabled,
  searchInput: "",
  moveItemPath: "",
  packages_location_id: "",
  packagesLoacationQty: "",
  movePartialQty: false,
  cantMoveToSameLocationForSingleLocation: false,
  isUndispatch: "",
  isUndispatchFullQuantity: false,
  isPartialMove: false,

  item: Ember.computed.alias("model.item"),
  searchModelName: "location",
  messageBox: Ember.inject.service(),

  sortProperties: ["createdAt:desc"],
  recentlyUsedLocations: Ember.computed.sort("model.locations", "sortProperties"),

  displayUserPrompt: false,
  showAllSetItems: false,
  selectedLocation: null,
  hideDetailsLink: true,

  sameSingleLocation: Ember.computed("selectedLocation", function() {
    if (this.get('item.packagesLocations').get('length') === 1){
     return this.get('item.packagesLocations').get('firstObject').get("location_id") === parseInt(this.get('selectedLocation.id'));
    }
  }),

  totalQty: Ember.computed('selectedLocation', function(){
    return localStorage['totalQty'];
  }),

  onSearchInputChange: Ember.observer("searchInput", function() {
    // wait before applying the filter
    if (this.get("searchInput")) {
      Ember.run.debounce(this, this.applyFilter, 0);
    }
  }),

  applyFilter() {
    var searchText = this.get("searchText");
    if (searchText.length > 0) {
      this.set("isLoading", true);
      this.set("hasNoResults", false);
      if(this.get("unloadAll")) { this.get("store").unloadAll(); }

      this.infinityModel("location",
        { perPage: 25, startingPage: 1, modelPath: 'filteredResults',stockRequest: true },
        { searchText: "searchText", itemId: "itemSetId" })
        .then(data => {
          if(this.get("searchText") === data.meta.search) {
            this.set("filteredResults", data);
            this.set("hasNoResults", data.get("length") === 0);
          }

          if(data.get("length") === 1) {
            this.set("selectedLocation", data.get('firstObject'));
            Ember.run.debounce(this, this.triggerDisplayMoveOverlay, 100);
          }
        })
        .finally(() => this.set("isLoading", false));
    }
    this.set("filteredResults", []);
  },

  triggerDisplayMoveOverlay(){
    this.set("displayUserPrompt", true);
  },

  actions: {
    displayMoveOverlay(location) {
      this.set("selectedLocation", location);
      if(this.get('sameSingleLocation')){
        this.set('cantMoveToSameLocationForSingleLocation', true);
      } else if(this.get('isUndispatch')){
        this.set('isUndispatchFullQuantity', true);
      } else if(this.get('isPartialMove')){
        this.set('movePartialQty', true);
      } else{
        this.set("displayUserPrompt", true);
      }
    },

    movePartialQty(){
      var location = this.get("selectedLocation");
      var item = this.get("item");
      var packagesLoacationQty = localStorage['packagesLoacationQty'];
      var totalQty = localStorage["totalQty"];

      var loadingView = getOwner(this).lookup('component:loading').append();

      var url = `/items/${item.id}/move_partial_quantity`;

      new AjaxPromise(url, "PUT", this.get('session.authToken'), { location_id: location.get("id"), package: packagesLoacationQty, total_qty: totalQty}).then(data => {
        this.get("store").pushPayload(data);
        this.transitionToRoute("items.partial_move", item);
      }).finally(() => {
        loadingView.destroy();
      });
    },

    undispatchFullQuantity(){
      var item = this.get('item');
      var location = this.get("selectedLocation");

      var url = `/items/${item.get('id')}/move_full_quantity`;
      var loadingView = getOwner(this).lookup('component:loading').append();

      new AjaxPromise(url, "PUT", this.get('session.authToken'), { location_id: location.get('id')}).then(data => {
        this.get("store").pushPayload(data);
        var itemBackLinkPath = this.get('moveItemPath');
        if(itemBackLinkPath === "items.index" || itemBackLinkPath === "items"){
          this.transitionToRoute(itemBackLinkPath);
        } else {
          this.transitionToRoute("items.detail", item);
        }
      })
      .catch((response) => {
        loadingView.destroy();
        var errorMessage = response.responseJSON.errors[0];
        if(errorMessage.toLowerCase().indexOf("error") >= 0) {
          this.get("messageBox").alert(errorMessage);
        }
      }).finally(() => {
        loadingView.destroy();
      });
    },

    moveItem() {
      var location = this.get("selectedLocation");
      var item = this.get("item");
      var packagesLoacationQty = localStorage['packagesLoacationQty'];

      var showAllSetItems = this.get("showAllSetItems");
      this.set("showAllSetItems", false);

      var loadingView = getOwner(this).lookup('component:loading').append();
      var url;
      if(this.get("isSet")) {
        url = `/items/${item.get('setItem.id')}/move_stockit_item_set`;
      } else {
        url = `/items/${item.get('id')}/move_stockit_item`;
      }

      new AjaxPromise(url, "PUT", this.get('session.authToken'), { location_id: location.get("id"), packages_location_and_qty: packagesLoacationQty} )
        .then(data => {
          var itemBackLinePath = this.get('moveItemPath');
          this.get("store").pushPayload(data);
          if(showAllSetItems) {
            this.transitionToRoute("items", {queryParams: { itemSetId: item.get("itemId") } });
          } if(itemBackLinePath === "items.index") {
            this.transitionToRoute(itemBackLinePath);
          } else {
            this.transitionToRoute("items.detail", item);
          }
        })
        .catch((response) => {
          loadingView.destroy();
          var errorMessage = response.responseJSON.errors[0];
          if(errorMessage.toLowerCase().indexOf("error") >= 0) {
            this.get("messageBox").alert(errorMessage);
          }
        })
        .finally(() => {
          loadingView.destroy();
        });
    }
  },

});
