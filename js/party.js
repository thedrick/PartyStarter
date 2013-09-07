$(document).ready(function() {
  Parse.initialize("vpkqQoxmJU4HqOx57O81id3RTSwuKTbGJprxGgQc", "mXbf5O1xhVSjlMb51tjuiXxPI8KOc6jd65upOj3O");

  var Party = Parse.Object.extend("Party");

  window.addParty = function(partyObj) {
    var party = new Party();
    party.set("name", partyObj.name);
    party.set("location", partyObj.location);
    party.set("description", partyObj.description);
    party.set("date", partyObj.date);
    party.save(null, {
      success: function(obj) {
        console.log("Successfully saved a party ", obj);
      }, 
      error: function(obj, err) {
        console.log("An error occured: ", err);
      }
    });
  }

  window.getParty = function(partyid) {
    var query = new Parse.Query(Party);
    query.get(partyid, {
      success: function(party) {
        console.log("retrieved party: ", party);
        return party;
      }
    }, {
      error: function(obj, err) {
        console.log("Failed to fetch object, error: ", err);
      }
    });
  }

  window.createParty = function() {
    var formArray = $("#createPartyForm").serializeArray();
    var party = new Party();
    for (var i = 0; i < formArray.length; i++) {
      party.set(formArray[i].name, formArray[i].value);
    }
    party.save(null, { 
      success: function(obj) {
        console.log("Successfully saved a party ", obj);
      }, 
      error: function(obj, err) {
        console.log("An error occured: ", err);
      }
    });
  }

<a>
        <div class="party">
          <div class="caption">
            <div class="title">Party Name</div>
            <div class="info">
              <div class="days-info">
                <span class="days1">30</span><br />
                <span class="days2">days left</span>
              </div>
              <div class="money-info">
                <span class="money1">$800</span><br />
                <span class="money2">needed</span>
              </div>
            </div>
          </div>
          <img src="img/test_party_pic.jpg" />
        </div>
      </a>

  window.loadParties() {
    var query = new Parse.Query(Party);
    var partiesElt = $(".parties");
    query.find({
      success: function(parties) {
        for (var i = 0; i < parties.length; i++) {
          var party = parties[i];
          var link = $("<a>");
          var partyObj = $("<div>").class("party").append($("<img>").attr("src", "img/test_party_pic.jpg"));
          var title = $("<div>").class("title").html(party.name);
          var info = $("<div>").class("days-info");
          var days1 = $("<span>").class("days1").html(30);
          var days2 = $("<span>").class("days2").html("days left");
          info.append(days1, days2);
          var moneyInfo = $("<div>").class("money-info");
          var money1 = $("<span>").class("money1").html(party.totalCost);
        }
      },
      error: function(error) {
        console.log("Error fetching parties: ", error);
      }
    });
  }

  $('#createPartyButton').on('click', window.createParty);
  $('.js-venmo-sign-in').on('click', Venmo.auth);
});
