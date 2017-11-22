import { isEqual } from '@ember/utils';
import { computed } from '@ember/object';
import { bool, alias } from '@ember/object/computed';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
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
  packagesLocations: hasMany('packages_location', { async: true }),

  ordersPackages:    hasMany('ordersPackages', { async: true }),
  images:       hasMany('image', { async: true }),

  isDispatched: bool('sentOn'),
  isDesignated: bool('designation'),
  orderCode: alias('designation.code'),
  updatedAt: attr("date"),

  imageUrl: alias("image.imageUrl"),
  designateFullSet: computed.localStorage(),

  isDispatchedForQuantity: computed('ordersPackages.[]', function(){
    return this.get('ordersPackages').isAny('state', 'dispatched');
  }),

  firstDesignatedOrdersPackage: computed('designatedOrdersPackages', function(){
    return this.get('designatedOrdersPackages').get('firstObject');
  }),

  available_qty: computed("quantity", function() {
    return this.get('quantity');
  }),

  thumbImageUrl: computed('favouriteImage.{angle,cloudinaryId}', function(){
    return this.get("favouriteImage.thumbImageUrl") || this.generateUrl(120, 120, true);
  }),

  validUndispatchedLocations: computed('packagesLocations.@each.quantity', function() {
    var dispatchedLocation = this.store.peekAll('location').filterBy('building', "Dispatched");
    var pkgsLocations = this.get("packagesLocations").filterBy('quantity');
    if(dispatchedLocation.length) {
      return pkgsLocations.rejectBy('locationId', parseInt(dispatchedLocation.get('firstObject.id'), 10));
    } else {
      return pkgsLocations;
    }
  }),

  validPackagesLocations: computed('packagesLocations.@each.quantity', function() {
    return this.get("packagesLocations").filterBy('quantity');
  }),

  orderPackagesMoreThenZeroQty: computed("ordersPackages.@each.quantity", function() {
    return this.get("ordersPackages").filterBy('quantity').filterBy("state", "designated");
  }),

  onHandQty: computed("ordersPackages.@each.quantity", function() {
    var totalQty = 0;
    this.get('ordersPackages').filterBy('state', "designated").filterBy("quantity").forEach(record => {
      totalQty += record.get('quantity');
    });
    return totalQty + this.get('quantity');
  }),

  designatedItemCount: computed("ordersPackages.@each.quantity", "ordersPackages.[]", function() {
    return this.get("ordersPackages").filterBy('state', "designated").length;
  }),

  designatedOrdersPackages: computed("ordersPackages.@each.state", function() {
    return this.get("ordersPackages").filterBy("state", "designated").filterBy("quantity");
  }),

  dispatchedOrdersPackages: computed("ordersPackages.@each.state", function() {
    return this.get("ordersPackages").filterBy("state", "dispatched").filterBy("quantity");
  }),

  dispatchedItemCount: computed("ordersPackages.@each.quantity", function() {
    return this.get("ordersPackages").filterBy('state', "dispatched").length;
  }),

  cancelledItemCount: computed("ordersPackages.@each.quantity", function() {
    return this.get("ordersPackages").filterBy('state', "cancelled").length;
  }),

  favouriteImage: computed('images.@each.favourite', function(){
    return this.get("images").filterBy("favourite", true).get("firstObject") || this.store.peekAll("image").filterBy("itemId", parseInt(this.id, 10)).filterBy("favourite", true).get("firstObject");
  }),

  desinatedAndDisaptchedItemPackages: computed("ordersPackages.[]", function() {
    var orderPackages = this.get("ordersPackages").filterBy("quantity");
    orderPackages.forEach(record => {
      if(record && record.get("state") === "cancelled") {
        orderPackages.removeObject(record);
      }
    });
    return orderPackages.get("length");
  }),

  hasOneDesignatedPackage: computed("ordersPackages.@each.state", function() {
    var designatedOrdersPackages = this.get("ordersPackages").filterBy("state", "designated");
    return (designatedOrdersPackages.get("length") > 1 || designatedOrdersPackages.get("length") === 0) ? false : designatedOrdersPackages[0];
  }),

  hasSingleDesignation: computed("orderPackages.[]", function(){
    return this.get('ordersPackages').filterBy('state', 'designated').get('length') === 1;
  }),

  totalDispatchedQty: computed("ordersPackages.@each.state", function() {
    var totalDispatchedQty = 0;
    var dispatchedOrdersPackages = this.get("ordersPackages").filterBy("state", "dispatched");
    dispatchedOrdersPackages.forEach(record => {
      totalDispatchedQty += parseInt(record.get("quantity"), 10);
    });
    return totalDispatchedQty;
  }),

  totalDesignatedQty: computed("ordersPackages.@each.state", function() {
    var totalDesignatedQty = 0;
    var designatedOrdersPackages = this.get("ordersPackages").filterBy("state", "designated");
    designatedOrdersPackages.forEach(record => {
      totalDesignatedQty += parseInt(record.get("quantity"), 10);
    });
    return totalDesignatedQty;
  }),

  hasOneDispatchedPackage: computed("ordersPackages.@each.state", function() {
    var dispatchedOrdersPackages = this.get("ordersPackages").filterBy("state", "dispatched");
    return (dispatchedOrdersPackages.get("length") > 1 || dispatchedOrdersPackages.get("length") === 0) ? false : dispatchedOrdersPackages[0];
  }),

  hasAllPackagesDispatched: computed("ordersPackages.@each.state", function() {
    var received_quantity = this.get("receivedQuantity");
    var totalDispatchedQty = 0;
    var dispatchedOrdersPackages = this.get("ordersPackages").filterBy("state", "dispatched");
    dispatchedOrdersPackages.forEach(record => {
      totalDispatchedQty += parseInt(record.get("quantity"), 10);
    });
    return (totalDispatchedQty === received_quantity) ? true : false;
  }),

  hasAllPackagesDesignated: computed("ordersPackages.@each.state", function() {
    var received_quantity = this.get("receivedQuantity");
    var totalDesignatedQty = 0;
    var designatedOrdersPackages = this.get("ordersPackages").filterBy("state", "designated");
    designatedOrdersPackages.forEach(record => {
      totalDesignatedQty += parseInt(record.get("quantity"), 10);
    });
    return (totalDesignatedQty === received_quantity) ? true : false;
  }),

  ordersPackagesWithStateDesignatedAndDispatched: computed("ordersPackages.[]", function() {
    var orderPackages = this.get("ordersPackages").filterBy("quantity");
    orderPackages.forEach(record => {
      if(record && record.get("state") === "cancelled") {
        orderPackages.removeObject(record);
      }
    });
    return orderPackages;
  }),

  availableQty: computed("quantity", function() {
    return this.get('quantity');
  }),

  minSetQty: computed('setItem.items', function() {
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

  isSingletonItem: computed('quantity', function() {
    return this.get("receivedQuantity") === 1;
  }),

  hasSingleLocation: computed('packagesLocations.[]', 'packagesLocationsList', function(){
    return isEqual(this.get('packagesLocationsList').length, 1);
  }),

  hasSingleAndDispatchLocation: computed('packagesLocations.[]', 'packagesLocations', function(){
    var pkgLocations = this.get('packagesLocations');
    return isEqual(pkgLocations.length, 1) && (!this.get("hasAllPackagesDispatched"));
  }),

  hasMultiLocations: computed('packagesLocations.[]', function(){
    return this.get('packagesLocations').length > 1;
  }),

  firstAllLocationName: computed('packagesLocations.[]', 'packagesLocations', function(){
    return this.get('packagesLocations').get('firstObject.location.name');
  }),

  firstLocationName: computed('packagesLocations.[]', 'packagesLocationsList', function(){
    return this.get('packagesLocationsList').get('firstObject.location.name');
  }),

  firstOrdersPackage: computed('ordersPackages.[]', function(){
    return this.get('ordersPackages.firstObject');
  }),

  packagesLocationsList: computed('packagesLocations.[]', function(){
    var packagesLocations = [];
    this.get('packagesLocations').forEach((packages_location) => {
      if(packages_location.get('location.building') !== 'Dispatched'){
        packagesLocations.pushObject(packages_location);
      }
    });
    return packagesLocations.uniq();
  }),

  availableQtyForMove: computed('packagesLocations.[]', function(){
    var quantityToMove = this.get('receivedQuantity');
    this.get('packagesLocations').forEach((packages_location) => {
      if(packages_location.get('location.building') === 'Dispatched'){
        quantityToMove -= packages_location.get('quantity');
      }
    });
    return quantityToMove;
  }),

  imageUrlList: computed('images', 'setItem.@each.items.images.[]', 'setItem.@each.items.@each.imageUrl', 'setItem.@each.items.@each.thumbImageUrl', function() {
    var imageList = [];
    this.store.peekAll("image").filterBy("itemId", parseInt(this.id, 10)).forEach((image) => imageList.pushObject(image.get("imageUrl")));
    return imageList.uniq();
  }),

  setImages: computed('setItem.@each.items.@each.imageUrlList.[]', 'images', 'setItem.@each.items.images.[]', 'setItem.@each.items.@each.imageUrl', 'setItem.@each.items.@each.thumbImageUrl',  function() {
    var setItemImages = [];
    this.get("setItem.items").forEach((item) => {
      setItemImages = setItemImages.concat(item.get("imageUrlList"));
    });
    return setItemImages.uniq();
  }),

  allowLabelPrint: computed("ordersPackages.[]", function() {
    return !(this.get('isDispatchedForQuantity')) && !this.get("isSet");
  })
});
