import Ember from "ember";
import InfinityRoute from "ember-infinity/mixins/route";

export default Ember.Controller.extend(InfinityRoute, {

  searchText: "",
  i18n: Ember.inject.service(),
  isLoading: false,
  hasNoResults: false,
  item: Ember.computed.alias("model.item"),

  sortProperties: ["recentlyUsedAt:desc"],
  recentlyUsedDesignations: Ember.computed.sort("model.designations", "sortProperties"),

  displayUserPrompt: false,
  showAllSetItems: false,
  selectedDesignation: null,

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
      this.infinityModel("designation",
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

    setOrder(order) {
      this.set("order", order);
    },

    clearSearch() {
      this.set("searchText", "");
    },

    displayMoveOverlay(designation) {
      this.set("displayUserPrompt", true);
      this.set("selectedDesignation", designation);
    }
  },

});
