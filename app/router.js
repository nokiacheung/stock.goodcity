import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  baseURL: config.rootURL
});

Router.map(function() {

  this.route('logout', { path: '/logout' });
  this.route('login');
  this.route('authenticate');
  this.route('search_code');
  this.route('select_location');
  this.route('search_organisation');

  this.route("items", function() {
    this.route("new");

    this.route("detail", { path: "/:item_id" });
    this.route("history", { path: "/:item_id/history" } );
    this.route("edit_images", { path: "/:item_id/edit_images" });
    this.route("search_location", { path: "/:item_id/search_location" });
    this.route("search_order", { path: "/:item_id/search_order" });
    this.route("search_code", { path: "/:item_id/search_code" });
    this.route("partial_designate", { path: "/:item_id/partial_designate" });
    this.route("partial_undesignate", { path: "/:item_id/partial_undesignate" });
    this.route("modify_designation", { path: "/:item_id/modify_designation" });
    this.route("partial_dispatch", { path: "/:item_id/partial_dispatch" });
    this.route("partial_move", { path: "/:item_id/partial_move" });
  });

  this.route("orders", function() {
    this.route("detail", { path: "/:order_id" });
    this.route("items", { path: "/:order_id/items" });
    this.route("contact", { path: "/:order_id/contact" });
    this.route("order_transport", { path: "/:order_id/transport" });
    this.route("purposes", { path: "/:order_id/purposes" });
    this.route("client", { path: "/:order_id/client" });
    this.route("info", { path: "/:order_id/info" });
  });

});

export default Router;
