import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import Ember from "ember";
import cloudinaryUrl from './cloudinary_url';

export default cloudinaryUrl.extend({

  imageUrl: Ember.computed.alias("image.imageUrl"),

  thumbImageUrl: Ember.computed('favouriteImage.{angle,cloudinaryId}', function(){
    return this.get("favouriteImage.thumbImageUrl") || this.generateUrl(120, 120, true);
  }),

  favouriteImage: Ember.computed('images.@each.favourite', function(){
    return this.get("images").filterBy("favourite", true).get("firstObject");
  }),

  notes:           attr('string'),
  grade:           attr('string'),
  inventoryNumber: attr('string'),
  caseNumber:      attr('string'),
  quantity:        attr('number'),

  length:          attr('number'),
  width:           attr('number'),
  height:          attr('number'),

  sentOn:          attr('date'),
  isSet:           attr('boolean'),
  hasBoxPallet:    attr('boolean'),
  itemId:          attr('number'),
  allowWebPublish: attr('boolean'),

  designation: belongsTo('designation', { async: false }),
  code:        belongsTo('code', { async: false }),
  donorCondition: belongsTo('donor_condition', { async: false }),
  setItem:        belongsTo('set_item', { async: false }),

  packages_locations: hasMany('packages_location', {async: false}),
  images:       hasMany('image', { async: true }),

  isDispatched: Ember.computed.bool('sentOn'),
  isDesignated: Ember.computed.bool('designation'),
  orderCode: Ember.computed.alias('designation.code'),
  updatedAt: attr("date"),

  hasSingleLocation: Ember.computed('packages_locations.[]', function(){
    return this.get('packages_locations').length === 1;
  }),

  firstLocationName: Ember.computed('packages_locations.[]', function(){
    return this.get('packages_locations').get('firstObject').get('location.name');
  }),

  allLocations: Ember.computed('packages_locations.[]', function(){
    var allLocations = [];
    this.get('packages_locations').forEach((packages_location) => allLocations.pushObject(packages_location.get('location.name')));
    return allLocations.uniq();
  }),

  packagesLocations: Ember.computed('packages_locations.[]', function(){
    return this.get('packages_locations');
  }),

  movedQty: Ember.computed("packages_locations.[]", function(){
    var moved_qty = 0;
    this.get('packages_locations').filterBy('is_first_created', false).forEach((packages_location) => moved_qty += packages_location.get("quantity"));
    return moved_qty;
  }),

  availableQtyToMove: Ember.computed("packages_locations.[]", "movedQty", function() {
    var original_qty = this.get('quantity');
    var moved_qty = this.get('movedQty');
    var available_qty = original_qty - moved_qty;
    return available_qty;
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
