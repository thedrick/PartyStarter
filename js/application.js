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
