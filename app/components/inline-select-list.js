import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import SelectList from './select-list';
import AjaxPromise from 'stock/utils/ajax-promise';

export default SelectList.extend({
  layoutName: 'components/select-list',
  store: service(),

  itemGrade: computed ('item.grade', function() {
    var itemGrade = this.get("item.grade") || 'B';
    return { id: `${itemGrade}` };
  }),

  itemCondition: computed('item.donorCondition', function() {
    var itemCondition = this.get('item.donorCondition.name') || 'U';
    return { id: `${itemCondition.charAt(0)}` };
  }),

  changeDonorCondition(conditionId) {
    var donorCondition = {
      "N": 1,
      "M": 2,
      "U": 3,
      "B": 4
    };
    return donorCondition[conditionId];
  },

  selectedValue: computed('name', 'item.grade', 'item.donorCondition', function() {
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
    var selectedId = this.get('selectedValue').id;
    if(key === "donor_condition_id") {
      packageParams[key] = this.changeDonorCondition(selectedId);
    } else {
      packageParams[key] = selectedId;
    }
    var loadingView = getOwner(this).lookup('component:loading').append();
    new AjaxPromise(url, "PUT", this.get('session.authToken'), {package: packageParams })
      .then(data => {
        this.get("store").pushPayload(data);
      })
      .finally(() => {
        loadingView.destroy();
      });
  }
});
