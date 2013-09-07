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
    "date" : "Monday 9:00 PM",
    "days" : 20,
    "totalCost" : 300,
    "photo" : "/img/test_party_pic.jpg"
  },
  {
    "name" : "Another Party",
    "date" : "Thursday 11:00 PM",
    "days" : 2,
    "totalCost" : 80,
    "photo" : "/img/test_party_pic.jpg"
  }]
});
