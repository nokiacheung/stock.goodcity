import searchModule from "../search_module";
import Ember from 'ember';

export default searchModule.extend({

  searchModelName: "designation",
  unloadAll: true,
  minSearchTextLength: 2
});
