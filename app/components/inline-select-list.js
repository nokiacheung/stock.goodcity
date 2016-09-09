import Ember from 'ember';
import SelectList from './select-list';
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default SelectList.extend({
  layoutName: 'components/select-list',
  store: Ember.inject.service(),

  content: Ember.computed(function(){
    return [
      { name: "A", id: "A" },
      { name: "B", id: "B" },
      { name: "C", id: "C" },
      { name: "D", id: "D" }
    ];
  }),

  change() {
    var item = this.get("item");
    var url = `/packages/${item.get('id')}`;
    var key = this.get('name');
    var packageParams = {};
    packageParams[key] = this.get('selectedValue').name;

    var loadingView = getOwner(this).lookup('component:loading').append();
    new AjaxPromise(url, "PUT", this.get('session.authToken'), {package: packageParams })
      .then(data => {
        this.get("store").pushPayload(data);
      })
      .finally(() => {
        loadingView.destroy();
      });
  },
});
