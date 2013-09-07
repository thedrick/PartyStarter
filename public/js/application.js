window.PartyStarter = Ember.Application.create({
  LOG_TRANSITIONS: true
});

var parseAdapter = Ember.ParseAdapter.create({
  applicationId: 'vpkqQoxmJU4HqOx57O81id3RTSwuKTbGJprxGgQc',
  restAPIKey: 'XG3SPH73WUohYoqXuEcSVdVznnZogPaZh6nLotqh'
});

Ember.Model.reopenClass({
  // Sets the primary key to equal parse's primary key field name
  primaryKey: 'objectId',
  // Use the adapter for all model classes
  adapter: parseAdapter
});

PartyStarter.Party = Ember.Model.extend({
  objectId: Ember.attr()
, date: Ember.attr()
, name: Ember.attr()
, description: Ember.attr()
, location: Ember.attr()
, minDonation: Ember.attr()
, totalCost: Ember.attr()
});
PartyStarter.Party.className = 'Party';

PartyStarter.IndexController = Ember.Controller.extend({
  actions: {
    venmoSignIn: function() {
      Venmo.auth();  
    }
  }
});

PartyStarter.PartiesController = Ember.Controller.extend({
  parties: [{
    "name" : "My Party",
    "location" : "My house",
    "date" : "Monday 9:00 PM",
    "photo" : "public/img/test_party_pic.jpg"
  },
  {

  }]
});
