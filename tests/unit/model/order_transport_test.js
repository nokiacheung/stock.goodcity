import { test, moduleForModel } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('order_transport', 'OrderTransport model',{
  needs: ['model:contact', 'model:designation']
});

test('scheduledDate: return schedul date in format "D MMMM YYYY"', function(assert){
  var model = this.subject({scheduledAt: "2016-09-29"});
  assert.equal(model.get("scheduledDate"), "29 September 2016");
});

test('type: returns tranport type', function(assert){
  var model = this.subject({transportType: "self"});
  assert.equal(model.get("type"), "Self");
});
