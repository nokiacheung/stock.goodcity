import Ember from 'ember';

export default Ember.Controller.extend({
  filter: '',
  searchText: '',
  fetchMoreResult: true,
  i18n: Ember.inject.service(),

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

  filteredResults: Ember.computed(function(){
    return this.get("model");
  }),

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
    },
  },

});
