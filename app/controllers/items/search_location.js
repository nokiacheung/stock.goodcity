import Ember from "ember";
import InfinityRoute from "ember-infinity/mixins/route";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Controller.extend(InfinityRoute, {

  searchText: "",
  i18n: Ember.inject.service(),
  isLoading: false,
  hasNoResults: false,
  item: Ember.computed.alias("model.item"),
  recentlyUsedLocations: Ember.computed.alias("model.locations"),

  displayUserPrompt: false,
  showAllSetItems: false,
  selectedLocation: null,

  hasSearchText: Ember.computed("searchText", function() {
    return !!this.get("searchText").trim();
  }),

  onSearchTextChange: Ember.observer("searchText", function() {
    // wait before applying the filter
    Ember.run.debounce(this, this.applyFilter, 500);
  }),

  applyFilter() {
    var searchText = this.get("searchText").trim();
    if (searchText.length > 0) {
      this.set("isLoading", true);
      this.set("hasNoResults", false);
      this.infinityModel("location",
        { perPage: 25, startingPage: 1, modelPath: 'filteredResults', stockRequest: true },
        { searchText: "searchText" })
        .then(data => {

            this.set("filteredResults", data);
            this.set("hasNoResults", data.get("length") === 0);

        })
        .finally(() => this.set("isLoading", false));
    } else {
      this.set("hasNoResults", false);
    }
    this.set("filteredResults", []);
  },

  afterInfinityModel(records) {
    var searchText = this.get("searchText").trim();
    if (searchText.length === 0) {
      records.replaceContent(0, 25, []);
    }
  },

  actions: {
    clearSearch() {
      this.set("searchText", "");
    },

    displayMoveOverlay(location) {
      this.set("displayUserPrompt", true);
      this.set("selectedLocation", location);
    },

    moveItem() {
      var location = this.get("selectedLocation");
      var item = this.get("item");

      var showAllSetItems = this.get("showAllSetItems");
      this.set("showAllSetItems", false);

      var loadingView = getOwner(this).lookup('component:loading').append();
      var url = `/items/${item.get('id')}/move_stockit_item`;

      new AjaxPromise(url, "PUT", this.get('session.authToken'), { location_id: location.get("id") })
        .then(data => {
          this.get("store").pushPayload(data);
          if(showAllSetItems) {
            this.transitionToRoute("items", {queryParams: { itemSetId: item.get("itemId") } });
          } else {
            this.transitionToRoute("items");
          }
        })
        .finally(() => {
          loadingView.destroy();
        });
    }
  },

});
