import Ember from "ember";
import searchModule from "../search_module";

export default searchModule.extend({

  item: Ember.computed.alias("model.item"),
  searchModelName: "designation",
  minSearchTextLength: 2,

  sortProperties: ["recentlyUsedAt:desc"],
  recentlyUsedDesignations: Ember.computed.sort("model.designations", "sortProperties"),

  displayUserPrompt: false,
  showAllSetItems: false,
  selectedDesignation: null,

  actions: {

    setOrder(order) {
      this.set("order", order);
    },

    displayMoveOverlay(designation) {
      this.set("displayUserPrompt", true);
      this.set("selectedDesignation", designation);
    }
  },

});
