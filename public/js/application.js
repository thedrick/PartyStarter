window.PartyStarter = Ember.Application.create({
  LOG_TRANSITIONS: true
});

var parseAdapter = Ember.ParseAdapter.create({
  applicationId: 'vpkqQoxmJU4HqOx57O81id3RTSwuKTbGJprxGgQc',
  restAPIKey: 'XG3SPH73WUohYoqXuEcSVdVznnZogPaZh6nLotqh'
});

Ember.Model.reopenClass({
  // Sets the primary key to equal parse's primary key field name
  primaryKey: 'objectId'
, collectionKey: 'results'
, adapter: parseAdapter
});

var Num = {
  deserialize: function(string) {
    if (!string && string !== 0) { return null; }
    return Number(string);
  },
  serialize: function (number) {
    if (!number && number !== 0) { return null; }
    return String(number);
  }
}

var FormBool = {
  deserialize: function(string) {
    if (!string && string !== 0) { return null; }
    return (string == "on");
  },
  serialize: function (bool) {
    if (!bool && bool !== 0) { return null; }
    return (bool ? "on" : "off");
  }
}

PartyStarter.Party = Ember.Model.extend({
  objectId: Ember.attr()
, date: Ember.attr(Date)
, host: Ember.attr()
, timeUntilValue: (function() {
    var then = moment(this.get("date"));
    if (!!then) {
      var time = then.fromNow()
        , text = time.substring(3, time.length - 4);
      if (text.split(' ')[0] == 'an') return '1'
      else return text.split(' ')[0];
    }
    return "";
  }).property('date')
, timeUntilUnit: (function() {
    var then = moment(this.get("date"));
    if (!!then) {
      var time = then.fromNow()
        , text = time.substring(3, time.length - 4)
        , val = text.split(' ')[1];
      if (val == 'h') {
        return 'Hours';
      } else if (val == '') {
        return 'Hour';
      } else if (val == 'min') {
        return 'Minutes'
      } else if (val == 'mo') {
        return 'Months';
      } else {
        return 'Days';
      }
    }
    return "";
  }).property('date')
, fancyDate: (function() {
    var time = moment(this.get("date"));
    if (!!time) {
      var displayDate = time.format('MMMM Do YYYY');
      return displayDate;
    }
    return "";
  }).property('date')
, fancyTime: (function() {
    var time = moment(this.get("date"));
    if (!!time) {
      var displayDate = time.format('hh:mm a');
      return displayDate;
    }
    return "";
  }).property('date')
, name: Ember.attr()
, mapdefault: Ember.computed(function() {
    return "/img/mapdefault.png";
  })
, hostname: Ember.attr()
, hostpicture: Ember.attr()
, numAttendees: Ember.attr(Num)
, description: Ember.attr()
, location: Ember.attr()
, minDonation: Ember.attr(Num)
, minDonationWithDollar: (function() {
    var amount = this.get("minDonation")
      , finMin = "$" + amount;
    return finMin;
  }).property('minDonation')
, totalCost: Ember.attr(Num)
, fundedCost: Ember.attr(Num)
, remainingCost: (function() {
    var total = this.get("totalCost")
      , funded = this.get("fundedCost")
      , remaining = total - funded;
    if (remaining < 0) {
      remaining = 0
    }
    return String(remaining);
  }).property('totalCost', 'fundedCost')
, flexible: Ember.attr(FormBool)
, headerBg: Ember.computed(function() {
    var headerImages = ['hands.jpg', 'lawn-party.jpg', 'party.jpg', 'pour.jpg', 'sitting.jpg', 'more-beer.jpg', 'miley.jpg', 'more-hands.jpg', 'chill-apt.jpg', 'cocktails.jpg', 'legs.jpg', 'lan.jpg', 'more-miley.jpg', 'twerk.jpg'];
    return "background: url('/img/" + headerImages[Math.floor(Math.random()*headerImages.length)] + "') no-repeat center center scroll;";
  })
});

PartyStarter.Party.className = 'Party';

PartyStarter.IndexController = Ember.Controller.extend({
  actions: {
    venmoSignIn: function() {
      Venmo.auth();  
    }
  }
});

PartyStarter.WelcomeController = Ember.Controller.extend({
  actions: {
    toggleCreateForm: function() {
      Ember.$('.top-img').toggleClass('host-form-active');
      if (Ember.$('.bottom-img').hasClass('after-transition')) {
        Ember.$('#createPartyName').blur();
        Ember.$('.bottom-img').removeClass('after-transition');
        setTimeout(function() {
          Ember.$('.bottom-img').removeClass('host-form-active');
        }, 50);
      } else {
        Ember.$('.bottom-img').addClass('host-form-active');
        Ember.$('#createPartyName').focus();
        setTimeout(function() {
          Ember.$('.bottom-img').addClass('after-transition');
        }, 200);
      }
    }
  }
});

PartyStarter.PlaceholderField = Ember.TextField.extend({
  attributeBindings: ['placeholder']
});

PartyStarter.PartyController = Ember.ObjectController.extend({
  actions: {
    pitchIn: function() {
      loadScale();
      var Attendee = Parse.Object.extend("Attendee");
      var user = Parse.User.current()
        , donationInput = $('.donate-input').val()
        , donation = donationInput.replace("$", "")
        , donationValue = Number(donation);

      var party = PartyStarter.Party.find(localStorage["currentParty"]);
        
      var minDonation = Number(party.get("minDonation"));
      if (minDonation > donationValue) {
        alert("You must donate at least $" + String(minDonation) + "!");
        return false;
      }
      var isNewAttendee = 0;
      var attendeeQuery = new Parse.Query(Attendee);
      attendeeQuery.equalTo("username", user.get("username"));
      attendeeQuery.equalTo("partyid", localStorage["currentParty"]);
      var attendee;
      attendeeQuery.first().then(function(result) {
        if (result) {
          attendee = result;
          var currentDonation = Number(attendee.get("donation")) + donationValue;
          attendee.set("donation", String(currentDonation));
        } else {
          attendee = new Attendee();
          isNewAttendee = 1;
          attendee.set("username", user.get("username"));
          attendee.set("partyid", localStorage["currentParty"]);
          attendee.set("donation", donation);
        }

        return attendee.save();
      }).then(function(attendee) {
        party.set("numAttendees", party.get("numAttendees") + isNewAttendee);
        party.set("fundedCost", party.get("fundedCost") + donationValue);
        party.save();
      }, function(err) {
        console.log("Couldn't get attendees");
        return;
      });
      $(".donate-input").val("").blur();

      debugger;
      Parse.Cloud.run('fundParty', { party_id: this.get('objectId'), amount: donationValue }, {
        success: function(response) {
          console.log(response);
        }
      , error: function(response) {
          console.log(response);
        }
      });
    }
  }
});

PartyStarter.AdminController = Ember.ArrayController.extend({
  actions: {
    fundEvent: function(objectId) {
      Parse.Cloud.run('payout', { party_id: objectId }, { 
        success: function(res) {
          console.log(res);
          Ember.$
        }
      , error: function(err) {
          console.log(err);
        }
      });
    }
  }
});
