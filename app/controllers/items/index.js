import { debounce } from '@ember/runloop';
import { observer } from '@ember/object';
import config from '../../config/environment';
import searchModule from "../search_module";

export default searchModule.extend({

  queryParams: ['searchInput', "itemSetId"],
  searchInput: "",
  itemSetId: null,

  isMobileApp: config.cordova.enabled,
  displayItemOptions: false,
  displayItemOptionsList: true,
  searchModelName: "item",
  minSearchTextLength: 2,

  onItemSetIdChange: observer("itemSetId", function() {
    // wait before applying the filter
    if (this.get("itemSetId")) {
      debounce(this, this.applyFilter, 0);
    }
  })
});
