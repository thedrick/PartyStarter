window.PartyStarter = Ember.Application.create({
  LOG_TRANSITIONS: true
});

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
