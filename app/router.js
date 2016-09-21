import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {

  this.route('logout', { path: '/logout' });
  this.route('login');
  this.route('authenticate');
  this.route('search_code');
  this.route('select_location');

  this.route("items", function() {
    this.route("new");

    this.route("detail", { path: "/:item_id" });
    this.route("edit_images", { path: "/:item_id/edit_images" });
    this.route("search_location", { path: "/:item_id/search_location" });
    this.route("search_order", { path: "/:item_id/search_order" });
    this.route("search_code", { path: "/:item_id/search_code" });
  });

  this.route("orders", function() {
    this.route("detail", { path: "/:order_id" });
    this.route("items", { path: "/:order_id/items" });
    this.route("contact", { path: "/:order_id/contact" });
    this.route("client", { path: "/:order_id/client" });
    this.route("info", { path: "/:order_id/info" });
  });

});

export default Router;
