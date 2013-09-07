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
, timeUntil: Ember.computed(function() {
    var then = moment(this.get('date'));
    if (!!then) {
      return then.fromNow();
    }
    return "never";
  })
, name: Ember.attr()
, description: Ember.attr()
, location: Ember.attr()
, minDonation: Ember.attr(Number)
, totalCost: Ember.attr(Number)
, photoUrl: Ember.attr()
, headerBg: Ember.computed(function() {
    var headerImages = ['hands.jpg', 'lawn-party.jpg', 'party.jpg', 'pour.jpg', 'sitting.jpg', 'more-beer.jpg', 'solo-cups.jpg'];
    return "background: url('../img/" + headerImages[Math.floor(Math.random()*headerImages.length)] + "') no-repeat top center scroll;";
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

