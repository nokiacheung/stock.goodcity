import Ember from 'ember';
import SelectList from './select-list';
import AjaxPromise from 'stock/utils/ajax-promise';
const { getOwner } = Ember;

export default SelectList.extend({
  layoutName: 'components/select-list',
  store: Ember.inject.service(),

  itemGrade: Ember.computed ('item.grade', function() {
    var itemGrade = this.get("item.grade") || 'B';
    return { id: `${itemGrade}` };
  }),

  itemCondition: Ember.computed('item.donorCondition', function() {
    var itemCondition = this.get('item.donorCondition.name') || 'U';
    return { id: `${itemCondition.charAt(0)}` };
  }),

  selectedValue: Ember.computed('name', function() {
    var name = this.get('name');
    if(name === "grade") {
      return this.get('itemGrade') || {};
    } else if(name === "donor_condition_id")  {
      return this.get('itemCondition') || {};
    }
  }),

  change() {
    var item = this.get("item");
    var url = `/packages/${item.get('id')}`;
    var key = this.get('name');
    var packageParams = {};
    packageParams[key] = this.get('selectedValue').id;
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
