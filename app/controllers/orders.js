import Ember from 'ember';

export default Ember.Controller.extend({
  filter: '',
  searchText: '',
  fetchMoreResult: true,
  i18n: Ember.inject.service(),
  isLoading: false,

  hasSearchText: Ember.computed('searchText', function(){
    return Ember.$.trim(this.get('searchText')).length;
  }),

  hasFilter: Ember.computed('filter', function(){
    return Ember.$.trim(this.get('filter')).length;
  }),

  onSearchTextChange: Ember.observer('searchText', function () {
    // wait before applying the filter
    Ember.run.debounce(this, this.applyFilter, 500);
  }),

  applyFilter: function() {
    this.set('filter', this.get('searchText'));
    this.set('fetchMoreResult', true);
  },

  filteredResults: Ember.computed("fetchMoreResult", "filter", {
    get() {
      var controller = this;
      var searchValue = this.get('filter').trim();

      if(searchValue.length > 0) {
        this.set("isLoading", true);
        return this.store.query('designation', { searchText: searchValue })
          .then(function(data){
            controller.set('fetchMoreResult', false);
            controller.set("isLoading", false);
            return controller.set("filteredResults", data);
          });
      }
      return [];
    },
    set(key, value) {
      return value;
    }
  }),

  actions: {
    clearSearch() {
      this.set('filter', '');
      this.set('searchText', '');
      this.set('fetchMoreResult', true);
    },

    cancelSearch() {
      Ember.$("#searchText").blur();
      this.send("clearSearch");
      this.transitionToRoute("index");
    },
  },

});
