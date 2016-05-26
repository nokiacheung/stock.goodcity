import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  area: DS.attr('string'),
  building: DS.attr('string'),

  name: Ember.computed('area', 'building', function() {
    var area = this.get("area");
    var building = this.get("building");
    return area ? `${area}-${building}` : building;
  }),
});
