import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('orders');

  this.route('order', { resetNamespace: true, path: 'orders/:order_id'}, function(){
    });
});

export default Router;
