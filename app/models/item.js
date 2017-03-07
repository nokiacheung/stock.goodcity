import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import Ember from "ember";
import cloudinaryUrl from './cloudinary_url';

export default cloudinaryUrl.extend({

  notes:             attr('string'),
  grade:             attr('string'),
  inventoryNumber:   attr('string'),
  caseNumber:        attr('string'),
  quantity:          attr('number'),
  receivedQuantity:  attr('number'),

  length:            attr('number'),
  width:             attr('number'),
  height:            attr('number'),

  sentOn:            attr('date'),
  isSet:             attr('boolean'),
  hasBoxPallet:      attr('boolean'),
  itemId:            attr('number'),
  allowWebPublish:   attr('boolean'),

  designation: belongsTo('designation', { async: true }),
  location:    belongsTo('location', { async: false }),
  code:        belongsTo('code', { async: false }),
  donorCondition: belongsTo('donor_condition', { async: false }),
  setItem:        belongsTo('set_item', { async: false }),
  packagesLocations: hasMany('packages_location', {async: false}),

  ordersPackages:    hasMany('ordersPackages', { async: true }),
  images:       hasMany('image', { async: true }),

  isDispatched: Ember.computed.bool('sentOn'),
  isDesignated: Ember.computed.bool('designation'),
  orderCode: Ember.computed.alias('designation.code'),
  updatedAt: attr("date"),

  imageUrl: Ember.computed.alias("image.imageUrl"),
  designateFullSet: Ember.computed.localStorage(),

  available_qty: Ember.computed("quantity", function() {
    return this.get('quantity');
  }),

  thumbImageUrl: Ember.computed('favouriteImage.{angle,cloudinaryId}', function(){
    return this.get("favouriteImage.thumbImageUrl") || this.generateUrl(120, 120, true);
  }),

  orderPackagesMoreThenZeroQty: Ember.computed("ordersPackages.@each.quantity", function() {
    return this.get("ordersPackages").filterBy('quantity').filterBy("state", "designated");
  }),

  onHandQty: Ember.computed("ordersPackages.@each.quantity", function() {
    var totalQty = 0;
    this.get('ordersPackages').filterBy('state', "designated").filterBy("quantity").forEach(record => {
      totalQty += record.get('quantity');
    });
    return totalQty + this.get('quantity');
  }),

  designatedItemCount: Ember.computed("ordersPackages.@each.quantity", "ordersPackages.[]", function() {
    return this.get("ordersPackages").filterBy('state', "designated").length;
  }),

  designatedOrdersPackages: Ember.computed("ordersPackages.@each.state", function() {
    return this.get("ordersPackages").filterBy("state", "designated").filterBy("quantity");
  }),

  dispatchedOrdersPackages: Ember.computed("ordersPackages.@each.state", function() {
    return this.get("ordersPackages").filterBy("state", "dispatched").filterBy("quantity");
  }),

  dispatchedItemCount: Ember.computed("ordersPackages.@each.quantity", function() {
    return this.get("ordersPackages").filterBy('state', "dispatched").length;
  }),

  cancelledItemCount: Ember.computed("ordersPackages.@each.quantity", function() {
    return this.get("ordersPackages").filterBy('state', "cancelled").length;
  }),

  favouriteImage: Ember.computed('images.@each.favourite', function(){
    return this.get("images").filterBy("favourite", true).get("firstObject");
  }),

  desinatedAndDisaptchedItemPackages: Ember.computed("ordersPackages.[]", function() {
    var orderPackages = this.get("ordersPackages").filterBy("quantity");
    orderPackages.forEach(record => {
      if(record && record.get("state") === "cancelled") {
        orderPackages.removeObject(record);
      }
    });
    return orderPackages.get("length");
  }),

  hasOneDesignatedPackage: Ember.computed("ordersPackages.@each.state", function() {
    var designatedOrdersPackages = this.get("ordersPackages").filterBy("state", "designated");
    return (designatedOrdersPackages.get("length") > 1 || designatedOrdersPackages.get("length") === 0) ? false : designatedOrdersPackages[0];
  }),

  totalDispatchedQty: Ember.computed("ordersPackages.@each.state", function() {
    var totalDispatchedQty = 0;
    var dispatchedOrdersPackages = this.get("ordersPackages").filterBy("state", "dispatched");
    dispatchedOrdersPackages.forEach(record => {
      totalDispatchedQty += parseInt(record.get("quantity"));
    });
    return totalDispatchedQty;
  }),

  totalDesignatedQty: Ember.computed("ordersPackages.@each.state", function() {
    var totalDesignatedQty = 0;
    var designatedOrdersPackages = this.get("ordersPackages").filterBy("state", "designated");
    designatedOrdersPackages.forEach(record => {
      totalDesignatedQty += parseInt(record.get("quantity"));
    });
    return totalDesignatedQty;
  }),

  hasOneDispatchedPackage: Ember.computed("ordersPackages.@each.state", function() {
    var dispatchedOrdersPackages = this.get("ordersPackages").filterBy("state", "dispatched");
    return (dispatchedOrdersPackages.get("length") > 1 || dispatchedOrdersPackages.get("length") === 0) ? false : dispatchedOrdersPackages[0];
  }),

  hasAllPackagesDispatched: Ember.computed("ordersPackages.@each.state", function() {
    var received_quantity = this.get("receivedQuantity");
    var totalDispatchedQty = 0;
    var dispatchedOrdersPackages = this.get("ordersPackages").filterBy("state", "dispatched");
    dispatchedOrdersPackages.forEach(record => {
      totalDispatchedQty += parseInt(record.get("quantity"));
    });
    return (totalDispatchedQty === received_quantity) ? true : false;
  }),

  hasAllPackagesDesignated: Ember.computed("ordersPackages.@each.state", function() {
    var received_quantity = this.get("receivedQuantity");
    var totalDesignatedQty = 0;
    var dispatchedOrdersPackages = this.get("ordersPackages").filterBy("state", "designated");
    dispatchedOrdersPackages.forEach(record => {
      totalDesignatedQty += parseInt(record.get("quantity"));
    });
    return (totalDesignatedQty === received_quantity) ? true : false;
  }),

  ordersPackagesWithStateDesignatedAndDispatched: Ember.computed("ordersPackages.[]", function() {
    var orderPackages = this.get("ordersPackages").filterBy("quantity");
    orderPackages.forEach(record => {
      if(record && record.get("state") === "cancelled") {
        orderPackages.removeObject(record);
      }
    });
    return orderPackages;
  }),

  availableQty: Ember.computed("quantity", function() {
    return this.get('quantity');
  }),

  minSetQty: Ember.computed('setItem.items', function() {
    if(this.get('isSet') && this.get('designateFullSet')) {
      var setItems = this.get('setItem.items');
      var minQty = setItems.canonicalState[0]._data.quantity;
      setItems.canonicalState.forEach(record =>{
        var qty = record._data.quantity;
        if(qty < minQty) {
          minQty = qty;
        }
      });
      return minQty;
    }
  }),

  hasSingleLocation: Ember.computed('packagesLocations.[]', 'packagesLocationsList', function(){
    return Ember.isEqual(this.get('packagesLocationsList').length, 1);
  }),

  firstLocationName: Ember.computed('packagesLocations.[]', 'packagesLocationsList', function(){
    return this.get('packagesLocationsList').get('firstObject.location.name');
  }),

  packagesLocationsList: Ember.computed('packagesLocations.[]', function(){
    var packagesLocations = [];
    this.get('packagesLocations').forEach((packages_location) => {
      if(packages_location.get('location.building') !== 'Dispatched'){
        packagesLocations.pushObject(packages_location);
      }
    });
    return packagesLocations.uniq();
  }),

  availableQtyForMove: Ember.computed('packagesLocations.[]', function(){
    var quantityToMove = this.get('receivedQuantity');
    this.get('packagesLocations').forEach((packages_location) => {
      if(packages_location.get('location.building') === 'Dispatched'){
        quantityToMove -= packages_location.get('quantity');
      }
    });
    return quantityToMove;
  }),

  imageUrlList: Ember.computed('images.[]', function() {
    var imageList = [];
    this.get("images").forEach((image) => imageList.pushObject(image.get("imageUrl")));
    return imageList.uniq();
  }),

  setImages: Ember.computed('setItem.@each.items.@each.imageUrlList.[]', function() {
    var setItemImages = [];
    this.get("setItem.items").forEach((item) => {
      setItemImages = setItemImages.concat(item.get("imageUrlList"));
    });
    return setItemImages.uniq();
  }),

  allowLabelPrint: Ember.computed("", function() {
    return !this.get("isDispatched") && !this.get("isSet");
  }),
});
