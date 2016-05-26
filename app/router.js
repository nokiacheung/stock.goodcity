import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {

  this.route('logout', { path: '/logout' });
  this.route('login');
  this.route('authenticate');

  this.route("orders", function() {
    this.route("detail", { path: "/:order_id" });
    this.route("items", { path: "/:order_id/items" });
  });

  this.route("contacts", function() {
    this.route("detail", { path: "/:contact_id" });
  });
});

export default Router;
