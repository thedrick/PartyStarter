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
    party.set('flexible', false);
    for (var i = 0; i < formArray.length; i++) {
      var element = formArray[i];
	    if (element == "minDonation" || element == "totalCost") {
		    party.set(element.name, string(element.value));
	    } else if (element == "flexible") { 
        party.set('flexible', true); 
      } else {
		    party.set(element.name, element.value);
	    }
    }
    party.set("host", user.id);
    party.set("hostname", user.get("name"));
    console.log("User: ", user);
    console.log("User picture: ", user.get("picture"));
    party.set("hostpicture", user.get("picture"));
	
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

  $('#createPartyButton').on('click', window.createParty);
  // $('.donate-btn').on('click', window.addAttendee);

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
