Parse.initialize("vpkqQoxmJU4HqOx57O81id3RTSwuKTbGJprxGgQc", "mXbf5O1xhVSjlMb51tjuiXxPI8KOc6jd65upOj3O");

$(document).ready(function() {

  var Party = Parse.Object.extend("Party");

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
      party.set(element.name, element.value);
    }
    party.set("host", user.id);
    party.set("fundedCost", 0);
	  var photoUploadControl = $("#createPartyPhoto")[0];
	  if (photoUploadControl.files.length > 0) {
  		var photo = photoUploadControl.files[0];
  		var name = "photo.jpg"
		  var parseFile = new Parse.File(name, photo);
	 }
	
	if (autocompleteLocation.getPlace() !== undefined) {
		var place = autocompleteLocation.getPlace();
		var point = {latitude: place.geometry.location.lat(),
					 longitude: place.geometry.location.lng()};
		var partyLocation = new Parse.GeoPoint(point);
		party.set("geoLocation", partyLocation);
	}
	
	parseFile.save().then(function() {
		console.log("Saved the picture");
		var parseUrl = parseFile.url();
		party.set("photoUrl", parseUrl);
		party.set("photoFile", parseFile);
	    party.save(null, { 
	      success: function(obj) {
	        console.log("Successfully saved a party ", obj);
	        console.log("url: ", obj.get("photoUrl"));
			    window.location = '/parties/' + obj.id;
	      }, 
	      error: function(obj, err) {
	        console.log("An error occured: ", err);
	      }
	    });
	}, function(error) {
		console.log("An error occured saving the picutre: ", error);
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
		  var partyImg = party.get("photoFile");
		  var img = $("<img>").attr("src", partyImg.url());
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

  window.addAttendee = function() {
    var user = Parse.User.current();
    var donation = $(".donate-input").val();
    if (donation.length == 0) {
      alert("You must enter a donation amount!");
      return;
    } else if (user == undefined) {
      alert("You must log in to donate!");
      return;
    }
    var Attendee = Parse.Object.extend("Attendee");
    var attendee = new Attendee();
    var donationValue = Number(donation);
    attendee.set("username", user.get("username"));
    attendee.set("donation", donationValue);
    attendee.set("partyid", localStorage["currentParty"]);
    attendee.save(null, {
      success: function(obj) {
        console.log("Successfully saved a new attendee", obj);
        var query = new Parse.Query(Party);
        query.get(localStorage["currentParty"], {
          success: function(result) {
            console.log(result);
            console.log("minDonation is ", result.get("minDonation"));
            if (Number(result.get("minDonation")) <= donationValue) {
              var currentFund = Number(result.get("fundedCost"));
              currentFund += donationValue
              result.set("fundedCost", String(currentFund));
              result.save(null, {
                success: function(obj) {
                  console.log("successfully updated current funds", obj);
                },
                error: function(err) {
                  console.log("Error incrementing the current funds ", err);
                }
              });
            } else {
              attendee.destroy({
                success: function() {
                  console.log("Successfully destoryed attendee after non-minimum dontaion attempted");
                  alert("You must submit at least the minimum donation to join this party.");
                },
                error: function(err) {
                  console.log("Encountered error: ", err);
                  alert("You must submit at least the minimum donation to join this party. Attendee destruction failed");
                }
              });
            }
          }
        });
      },
      error: function(err) {
        console.log("Error saving new attendee", err);
      }
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
