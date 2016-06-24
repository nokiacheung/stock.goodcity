import Ember from "ember";
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Component.extend({
  displayUserPrompt: false,
  showAllSetItems: false,
  displaySetBlock: true,

  store: Ember.inject.service(),

  actions: {
    displayDesignateOverlay() {
      this.set("displayUserPrompt", true);
    },

    undesignateItem() {

    }
  }

});
