import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import '../factories/item';
import '../factories/location';
import '../factories/designation';
import '../factories/code';
import FactoryGuy from 'ember-data-factory-guy';
import { mockFindAll } from 'ember-data-factory-guy';

var App, location1, designation, code;

module('Acceptance: Add item to inventory', {
  beforeEach: function() {
    App = startApp({}, 2);
    visit("/");
    var data = {"user_profile": {"id": 2, "first_name": "David", "last_name": "Dara51", "mobile": "61111111", "permission_id": 4}, "permissions": [{"id": 4, "name": "Supervisor"}]};

    $.mockjax({url:"/api/v1/auth/current_user_profil*",
      responseText: data });
    location1 = FactoryGuy.make("location");
    designation = FactoryGuy.make("designation", { state: "closed" });
    mockFindAll('designation').returns({json: {designations: [designation.toJSON({includeId: true})]}});
    mockFindAll('location').returns({json: {locations: [location1.toJSON({includeId: true})]}});
    code = FactoryGuy.make("code", {location: location1});
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test("Check validation for 'Add item to inventory ' page''", function(assert) {
  assert.expect(4);
  andThen(function() {
    visit("/search_code");
  });

  $.mockjax({url: '/api/v1/package_type*', type: 'GET', status: 200,responseText: {
      codes: [code.toJSON({includeId: true})]
    }
  });
  andThen(function() {
    assert.equal(currentPath(), "search_code");
    //fill search box with package_type name i.e code.name
    fillIn("#searchText", code.get('name'));
    //click on first package_type
    click(find('.list li:first')[0]);
    //generate inventory_number for new package
    $.mockjax({url:"/api/v1/inventory*", type: 'POST', status: 200,responseText:{"inventory_number":"000311"}});
    //stub image request dummy values
    $.mockjax({url:"/api/v1/images/generate_sign*", type: 'GET', status: 200, responseText:{"api_key": 123456789876543, "signature": "3ec17bf700bc23446d61932385d", "timestamp": 1234567891, "tags": "staging"}});
    andThen(function() {
      //after click on package_type redirect to new item creation page
      assert.equal(currentPath(), "items.new");
      //clear description by clicking clear button for validation
      Ember.$('.remove-text').click();
      //verify description is empty
      assert.equal($('#description').val(), '');
      //click submit button to trigger validation boxes
      click(find('.button.expand:last'));
      andThen(function() {
        //check if description error box is 'visible'
        assert.equal($('#description').siblings('.input-error').is(":visible"), true);

        //unable to click pop up message box buttons
        // click($('.button.secondary.expand'));
        // andThen(function() {
        //   Ember.$('#messageBox #btn1')[0].click();
        // });

        // andThen(function() {
        //   assert.equal(currentPath(), "/");
        // });
      });
    });
  });
});



// test("Redirect to /search_code after clicking Add item to inventory and save redirects to items details page", function(assert) {
//   assert.expect(13);

//   $.mockjax({url: '/api/v1/package_type*', type: 'GET', status: 200,responseText: {
//       codes: [code.toJSON({includeId: true})]
//     }
//   });
//   click($('.center-text a'));
//   andThen(function() {
//     assert.equal(currentPath(), "search_code");
//     //fill search box with package_type name i.e code.name
//     fillIn("#searchText", code.get('name'));
//     //click on first package_type
//     click($('.list li:first')[0]);
//     //generate inventory_number for new package
//     $.mockjax({url:"/api/v1/inventory*", type: 'POST', status: 200,responseText:{"inventory_number":"000311"}});
//     //stub image request dummy values
//     $.mockjax({url:"/api/v1/images/generate_sign*", type: 'GET', status: 200, responseText:{"api_key": 123456789876543, "signature": "3ec17bf700bc23446d61932385d", "timestamp": 1234567891, "tags": "staging"}});
//     andThen(function() {
//       //after click on package_type redirect to new item creation page
//       assert.equal(currentPath(), "items.new");

//       assert.equal($('#qty').val(), '1');
//       //verify package_type name
//       assert.equal($('.columns .left input').last().val(), code.get('name'));
//       //fill description
//       assert.equal($('#description').val(), code.get('name'));
//       assert.equal($('#height').val(), "");
//       assert.equal($('#width').val(), "");
//       assert.equal($('#length').val(), "");
//       //select grade
//       assert.equal($('label select').val(), "B");
//       //select condition
//       assert.equal($('#condition-select').val(), "U");
//       //check  #Donation input box
//       assert.equal($('.small-9.columns input').first().val(), "");
//       //check location input box
//       assert.equal($('.small-9.columns input').last().val(), location1.get('displayName'));
//       // check inventory-number
//       assert.equal($('.inventory-number').text().match(/\d+/g)[0], "000311");
//     });
//     // andThen(function() {
//     //     //click save button
//     //     click($('.button.expand').last());
//     //     //genrate new item data
//     //     var loc = FactoryGuy.make("location", { id: 7 });
//     //     var pkgLocation = FactoryGuy.make("packages_location", {id: 764, location: loc});
//     //     var pkg = FactoryGuy.make("item", { id: 971, quantity: 1,  notes: "Baby Crib, Set (frame, mattress)", inventoryNumber:"000317", "package_type_id":9, packageLocations: [ pkgLocation ]  });
//     //     var code1 = FactoryGuy.make("code", { id: 9, name: "Baby Crib, Set (frame, mattress)", code: "BBS", location: loc  });

//     //     $.mockjax({url:"/api/v1/package*", type: 'POST', status: 200,responseText:{
//     //       item : pkg.toJSON({includeId: true}),
//     //       code : [ code1.toJSON({includeId: true}) ],
//     //       locations: [ loc.toJSON({includeId: true}) ],
//     //       packages_locations:[pkgLocation.toJSON({includeId: true})]
//     //       }});

//     //     $.mockjax({url:"api/v1/stockit_items/*", type: 'GET', status: 200,responseText:{
//     //       item : pkg.toJSON({includeId: true}),
//     //       code : [ code1.toJSON({includeId: true}) ],
//     //       locations: [ loc.toJSON({includeId: true}) ],
//     //       packages_locations:[pkgLocation.toJSON({includeId: true})]
//     //     }});

//     //     andThen(function() {
//     //       assert.equal(currentPath(), "items.detail");
//     //     });
//     //   });

//   });
// });
