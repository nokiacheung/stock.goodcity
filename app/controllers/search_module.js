import Ember from "ember";
import InfinityRoute from "ember-infinity/mixins/route";

export default Ember.Controller.extend(InfinityRoute, {

  searchText: "",
  i18n: Ember.inject.service(),
  isLoading: false,
  hasNoResults: false,
  itemSetId: null,

  hasSearchText: Ember.computed("searchText", function() {
    return !!this.get("searchText").trim();
  }),

  onSearchTextChange: Ember.observer("searchText", function() {
    // wait before applying the filter
    this.set("itemSetId", null);
    Ember.run.debounce(this, this.applyFilter, 500);
  }),

  applyFilter() {
    var searchText = this.get("searchText").trim();
    if (searchText.length > 0) {
      this.set("isLoading", true);
      this.set("hasNoResults", false);
      this.get("store").unloadAll();
      this.infinityModel(this.get("searchModelName"),
        { perPage: 25, startingPage: 1, modelPath: 'filteredResults' },
        { searchText: "searchText", itemId: "itemSetId" })
        .then(data => {
          if(this.get("searchText").trim() === data.meta.search) {
            this.set("filteredResults", data);
            this.set("hasNoResults", data.get("length") === 0);
          }
        })
        .finally(() => this.set("isLoading", false));
    }
    this.set("filteredResults", []);
  },

  afterInfinityModel(records) {
    var searchText = this.get("searchText").trim();
    if (searchText.length === 0 || searchText !== records.meta.search) {
      records.replaceContent(0, 25, []);
    }
  },

  actions: {
    clearSearch() {
      this.set("searchText", "");
    },
  }
});
