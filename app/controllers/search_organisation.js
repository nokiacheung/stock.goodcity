import Ember from "ember";
import searchModule from "./search_module";

export default searchModule.extend({
  searchModelName: "organisation",

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
