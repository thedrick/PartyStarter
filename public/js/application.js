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
, date: Ember.attr()
, name: Ember.attr()
, description: Ember.attr()
, location: Ember.attr()
, minDonation: Ember.attr()
, totalCost: Ember.attr()
, photoUrl: Ember.attr()
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

