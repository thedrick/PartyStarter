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
