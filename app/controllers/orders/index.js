import searchModule from "../search_module";

export default searchModule.extend({

  searchModelName: "designation",
  unloadAll: true,
  minSearchTextLength: 2,

  onItemLoaded: function (record) {
    if (record.get("gcOrganisationId")) {
      this.store.findRecord("gc_organisation", record.get("gcOrganisationId"));
    }
    if(record.constructor.toString() === "stock@model:designation:") {
      this.store.query("orders_package", { search_by_order_id: record.get("id") });
    }
  }


});
