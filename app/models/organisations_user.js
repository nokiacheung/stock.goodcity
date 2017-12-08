import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  organisation: belongsTo('organisation', { async: false }),
  user: belongsTo('user', { async: false })
});
