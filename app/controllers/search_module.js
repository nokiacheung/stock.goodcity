import Ember from "ember";
import InfinityRoute from "ember-infinity/mixins/route";

export default Ember.Controller.extend(InfinityRoute, {

  sanitizeString(str){
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return str.trim();
  },

  searchText: Ember.computed({
    get() {
      return "";
    },

    set(key, value) {
      return this.sanitizeString(value);
    }
  }),

  i18n: Ember.inject.service(),
  isLoading: false,
  hasNoResults: false,
  itemSetId: null,
  unloadAll: false,

  hasSearchText: Ember.computed("searchText", function() {
    return !!this.get("searchText").trim();
  }),

  onSearchTextChange: Ember.observer("searchText", function() {
    // wait before applying the filter
    this.set("itemSetId", null);
    Ember.run.debounce(this, this.applyFilter, 500);
  }),

  applyFilter() {
    var searchText = this.get("searchText");
    if (searchText.length > 0) {
      this.set("isLoading", true);
      this.set("hasNoResults", false);
      if(this.get("unloadAll")) { this.get("store").unloadAll(); }

      this.infinityModel(this.get("searchModelName"),
        { perPage: 25, startingPage: 1, modelPath: 'filteredResults',stockRequest: true },
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
    var searchText = this.get("searchText");
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
