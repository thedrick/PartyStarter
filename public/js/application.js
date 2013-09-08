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

PartyStarter.Party = Ember.Model.extend({
  objectId: Ember.attr()
, date: Ember.attr(Date)
, timeUntil: (function() {
    var then = moment(this.get("date"));
    if (!!then) {
      var time = then.fromNow();
      return time.substring(3, time.length - 4);
    }
    return "never";
  }).property('date')
, name: Ember.attr()
, numAttendees: Ember.attr()
, description: Ember.attr()
, location: Ember.attr()
, minDonation: Ember.attr(Number)
, minDonationWithDollar: (function() {
	var amount = this.get("minDonation");
	var finMin = "$" + amount;
	console.log(finMin);
	return finMin;
}).property('minDonation')
, totalCost: Ember.attr(Number)
, fundedCost: Ember.attr(Number)
, remainingCostUpdate: (function() {
	var total = Number(this.get("totalCost"));
	var funded = Number(this.get("fundedCost"));
	var remaining = total - funded;
	return String(remaining);
}).property('remainingCost')
// , photoUrl: Ember.attr()
, headerBg: Ember.computed(function() {
    var headerImages = ['hands.jpg', 'lawn-party.jpg', 'party.jpg', 'pour.jpg', 'sitting.jpg', 'more-beer.jpg', 'solo-cups.jpg', 'miley.jpg', 'more-hands.jpg', 'chill-apt.jpg', 'cocktails.jpg', 'legs.jpg', 'lan.jpg'];
    return "background: url('../img/" + headerImages[Math.floor(Math.random()*headerImages.length)] + "') no-repeat top center scroll;";
  })
, feedBg: Ember.computed(function() {
    var headerImages = ['hands.jpg', 'lawn-party.jpg', 'party.jpg', 'pour.jpg', 'sitting.jpg', 'more-beer.jpg', 'solo-cups.jpg', 'miley.jpg', 'more-hands.jpg', 'chill-apt.jpg', 'cocktails.jpg', 'legs.jpg', 'lan.jpg'];
    return "background: url('../img/" + headerImages[Math.floor(Math.random()*headerImages.length)] + "') no-repeat center center scroll;";
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

