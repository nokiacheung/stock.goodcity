import Ember from "ember";
import searchModule from "./search_module";

export default searchModule.extend({
  minSearchTextLength: 2,

  onSearchTextChange: Ember.observer("searchText", function(){
    if(this.get('searchText')){
      Ember.run.debounce(this, this.applyFilter, 0);
    }
  }),

  applyFilter() {
    var searchText = this.get("searchText");
    if (searchText.length > 0) {
      this.set("isLoading", true);
      this.set("hasNoResults", false);
      if(this.get("unloadAll")) { this.get("store").unloadAll(); }

      this.infinityModel("organisation",
        { perPage: 25, startingPage: 1, modelPath: 'filteredResults',stockRequest: true },
        { searchText: "searchText" })
        .then(data => {
          // if(this.get("searchText") === data.meta.search) {
            this.set("filteredResults", data);
            // this.set("hasNoResults", data.get("length") === 0);
          // }
        })
        .finally(() => this.set("isLoading", false));
    }
    this.set("filteredResults", []);
  },

  actions: {
    clearSearch(isCancelled) {
      this.set('filter', '');
      this.set('searchText', '');
      this.set('fetchMoreResult', true);
      if(!isCancelled) { Ember.$("#searchText").focus(); }
    },

    cancelSearch() {
      Ember.$("#searchText").blur();
      this.send("clearSearch", true);
      this.transitionToRoute("index");
    }
  }
});
