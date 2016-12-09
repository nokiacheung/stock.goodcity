import Ember from "ember";
import searchModule from "../search_module";

export default searchModule.extend({

  queryParams: ['isSet', 'showDispatchOverlay', 'partial_qty'],
  isSet: false,
  showDispatchOverlay: false,
  toDesignateItem: true,
  partial_qty: 0,

  item: Ember.computed.alias("model.item"),
  searchModelName: "designation",
  minSearchTextLength: 2,

  sortProperties: ["recentlyUsedAt:desc"],
  recentlyUsedDesignations: Ember.computed.sort("model.designations", "sortProperties"),

  displayUserPrompt: false,
  showAllSetItems: false,
  selectedDesignation: null,
  toggleOverlay: true,

  actions: {

    setOrder(order) {
      this.set("order", order);
      this.toggleProperty("toggleOverlay");
    },

    displayMoveOverlay(designation) {
      this.set("displayUserPrompt", true);
      this.set("selectedDesignation", designation);
    }
  },

});
