Parse.initialize("vpkqQoxmJU4HqOx57O81id3RTSwuKTbGJprxGgQc", "mXbf5O1xhVSjlMb51tjuiXxPI8KOc6jd65upOj3O");

$(document).ready(function() {

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

  window.findParties = function() {
    var query = new Parse.Query(Party);
    query.find({
      success: function(result) {
        return result;
      },
      error: function(error) {
        return error;
      }
    });
  }

  window.loadParties = function() {
    var query = new Parse.Query(Party);
    var partiesElt = $(".parties");
    query.find({
      success: function(parties) {
        for (var i = 0; i < parties.length; i++) {
          var party = parties[i];
          var link = $("<a>");
          var caption = $("<div>").addClass("caption");
          var img = $("<img>").attr("src", "img/test_party_pic.jpg");
          var partyObj = $("<div>").addClass("party");
          var title = $("<div>").addClass("title").html(party.get("name"));
          var info = $("<div>").addClass("info");
          var daysInfo = $("<div>").addClass("days-info");
          var days1 = $("<span>").addClass("days1").html(30);
          var days2 = $("<span>").addClass("days2").html("days left");
          daysInfo.append(days1, days2);
          var moneyInfo = $("<div>").addClass("money-info");
          var money1 = $("<span>").addClass("money1").html(party.get("totalCost"));
          var money2 = $("<span>").addClass("money2").html("needed");
          moneyInfo.append(money1, money2);
          info.append(daysInfo, moneyInfo);
          caption.append(title, info);
          partyObj.append(caption, img);
          link.append(partyObj);
          partiesElt.append(link);
        }
        window.bindParties();
      },
      error: function(error) {
        console.log("Error fetching parties: ", error);
      }
    });
  }

  window.bindParties = function() {
    $('.party').mouseenter(function() {
      var image = $(this).find('img'),
      caption = $(this).find('.caption');
    
      caption.width(image.width());
      caption.height(image.height());
      caption.fadeIn();
    }).mouseleave(function() {
      var image = 
      $(this).find('img'),
      caption = $(this).find('.caption');
    
      caption.width(image.width());
      caption.height(image.height());
      caption.fadeOut();
    });
  }

  $('.top-img .subtitle').on('click', function() {
    $('.top-img').toggleClass('host-form-active');
    if ($('.bottom-img').hasClass('after-transition')) {
      $('.bottom-img').removeClass('after-transition');
      setTimeout(function() {
        $('.bottom-img').removeClass('host-form-active');
      }, 50);
    } else {
      $('.bottom-img').addClass('host-form-active');
      setTimeout(function() {
      $('.bottom-img').addClass('after-transition');
      }, 200);
    };
    $('#createPartyName').focus()
    
  })

  $('#createPartyButton').on('click', window.createParty);
});

function initializePlaces() {
  var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(40.412189,-80.0457),
      new google.maps.LatLng(40.519802,-79.871635));
  var locationInput = document.getElementById('createPartyLocation');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position);
      var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
      var bounds = new google.maps.Circle({ center: center, radius: 800 }).getBounds();
      var options = {
        bounds: bounds,
        types: []
      }
      autocompleteLocation = new google.maps.places.Autocomplete(locationInput, options);
    });
  } else {
    console.log("No geolocation");
  }
    
}

google.maps.event.addDomListener(window, 'load', initializePlaces);
