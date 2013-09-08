Parse.initialize("vpkqQoxmJU4HqOx57O81id3RTSwuKTbGJprxGgQc", "mXbf5O1xhVSjlMb51tjuiXxPI8KOc6jd65upOj3O");

$(document).ready(function() {

  var Party = Parse.Object.extend("Party");
  var Attendee = Parse.Object.extend("Attendee");

  window.createParty = function() {
    var user = Parse.User.current();
    if (!user) {
      alert("You must be logged in to create a party!");
      return;
    }
    var formArray = $("#createPartyForm").serializeArray();
    var party = new Party();
    for (var i = 0; i < formArray.length; i++) {
      var element = formArray[i];
	  if (element == "minDonation") {
		  party.set("minDonation", string(element.value));
	  }
      else {
		  party.set(element.name, element.value);
	  }
    }
    party.set("host", user.id);
	
	if (autocompleteLocation.getPlace() !== undefined) {
		var place = autocompleteLocation.getPlace();
		var point = {latitude: place.geometry.location.lat(),
					 longitude: place.geometry.location.lng()};
		var partyLocation = new Parse.GeoPoint(point);
		party.set("geoLocation", partyLocation);
	}

	party.set("fundedCost", "0");
	party.set("numAttendees", "0");
	party.save(null, { 
		success: function(obj) {
	        console.log("Successfully saved a party ", obj);
	        // console.log("url: ", obj.get("photoUrl"));
			    window.location = '/parties/' + obj.id;
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

  window.addAttendee = function() {
    var user = Parse.User.current();
    var donation = $(".donate-input").val();
    var donationValue = Number(donation);
	  var partyQuery = new Parse.Query(Party);
	  partyQuery.get(localStorage["currentParty"]).then(function(party) {
      console.log(party);
		  var minDonation = Number(party.get("minDonation"));
		  if (minDonation > donationValue) {
			  alert("You must donate at least $" + String(minDonation) + "!");
			  return;
		  }
		  var isNewAttendee = 0;
		  var attendeeQuery = new Parse.Query(Attendee);
		  attendeeQuery.equalTo("username", user.get("username"));
		  attendeeQuery.equalTo("partyid", localStorage["currentParty"]);
		  var attendee;
		  attendeeQuery.find().then(function(result) {
          console.log(result);
		      if (result && result.length > 0) {
		        attendee = result[0];
		        var currentDonation = Number(attendee.get("donation"));
		        currentDonation += donationValue;
		        attendee.set("donation", String(currentDonation));
		      } else {
		        attendee = new Attendee();
		        isNewAttendee = 1;
		        attendee.set("username", user.get("username"));
		        attendee.set("partyid", localStorage["currentParty"]);
		        attendee.set("donation", donation);
		      }
			  attendee.save().then(function() {
          party.set("numAttendees", String(Number(party.get("numAttendees")) + isNewAttendee));
          party.set("fundedCost", String(Number(party.get("fundedCost")) + donationValue));
          party.save();
        });
		  }, function(err){
			  console.log("Couldn't get attendees");
			  return;
		  });
	  }, function(err) {
		  console.log("Couldn't find party");
		  return;
	  });
  }
  
  $('#createPartyButton').on('click', window.createParty);
  $('.donate-btn').on('click', window.addAttendee);

});

function initializePlaces() {
  var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(40.412189,-80.0457),
      new google.maps.LatLng(40.519802,-79.871635));
  var locationInput = document.getElementById('createPartyLocation');
  if (locationInput == null) {
    return;
  }

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
