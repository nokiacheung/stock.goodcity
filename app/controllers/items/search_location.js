import Ember from "ember";
import InfinityRoute from "ember-infinity/mixins/route";

export default Ember.Controller.extend(InfinityRoute, {

  searchText: "",
  i18n: Ember.inject.service(),
  isLoading: false,
  hasNoResults: false,

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
    }
  },

});
