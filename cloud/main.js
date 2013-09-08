Parse.Cloud.define("linkVenmo", function(request, response) {
  var code = request.params['code']
    , endpoint = "https://api.venmo.com/oauth/access_token"  
    , client_id = "1353"
    , client_secret = "n3UygV7jTk8HCRTPuKubdygDvxF7VKD5"
    , user = request.user;

  console.log("code: " + code);

  Parse.Cloud.httpRequest({
    method: 'POST'
  , url: endpoint
  , body: {
      client_id: client_id
    , client_secret: client_secret
    , code: code
    }
  , success: function(res) {
      var token = res.data.access_token
        , user_info = res.data.user;

      console.log("token: " + token);

      console.log("email: " + user_info.email);

      Parse.User.logIn(user_info.email, "fake venmo password", {
        success: function(u) {
          user = u;
          user.set('venmo_token', token);
          user.set('picture', user_info.picture.replace('/u/v1/s', '/u/v1/l'));
          console.log("logged in!");
          user.save(null, {
            success: function() {
              response.success({ username: user_info.email, token: token });
            }
          , error: function() {
              response.error("Sorry, something went wrong.");
            }
          });
        }
      , error: function() {
          user = new Parse.User();
          user.set('username', user_info.email);
          user.set('email', user_info.email);
          user.set('name', user_info.name);
          user.set('picture', user_info.picture.replace('/u/v1/s', '/u/v1/l'));
          user.set('venmo_token', token);
          user.set('password', "fake venmo password");
          console.log("signed up!");
          user.signUp(null, {
            success: function() {
              response.success({ username: user_info.email, token: token });
            }
          , error: function() {
              response.error("Sorry, something went wrong.");
            }
          });
        }
      });
    }
  , error: function(res) {
      response.error("Sorry, something went wrong.");
    }
  });
});

Parse.Cloud.define('fundParty', function(request, response) {
  var party_id = request.params['party_id']
    , amount = request.params['amount']
    , user = request.user;

  if (!user) {
    return response.error("Not logged in!");
  }

  var noteForParty = function(party) {
    return "Funded party '" + party.get('name') + "'!";
  };

  (new Parse.Query("Party")).equalTo("objectId", party_id).first().then(function (party) {
    (new Parse.Query(Parse.User)).equalTo("objectId", party.get('host')).first().then(function (host) {
      return Parse.Cloud.httpRequest({
        method: 'POST'
      , url: "https://api.venmo.com/payments"
      , body: {
          note: noteForParty(party)
        , email: "sri.raghavan.1+partyescrow@gmail.com"
        , access_token: user.get('venmo_token')
        , amount: amount
        }
      });
    }, function () {
      response.error("Failed to load user for party", party.id); 
    }).then(function(res) {
      response.success(res);
    }, function(error) {
      response.error(error);
    });
  }, function () { 
    response.error("Failed to load party");
  });
});

Parse.Cloud.define('payout', function(request, response) {
  var party_id = request.params['party_id'];

  (new Parse.Query("Party")).equalTo("objectId", party_id).first().then(function(party) {
    (new Parse.Query(Parse.User)).equalTo("objectId", party.get('host')).first().then(function (host) {
      var funded = parseFloat(party.get('fundedCost'))
        , total = parseFloat(party.get('totalCost'));

      console.log("funded: " + funded);
      console.log("total: " + total);
      console.log("flex: " + party.get('flexible'));

      if (funded > total || party.get('flexible')) {
        /*
        return Parse.Cloud.httpRequest({
          method: 'POST'
        , url: "https://api.venmo.com/payments"
        , body: {
            note: noteForParty(party)
          , email: host.get('email');
          , access_token: "JwaqqrXxhQcXcEmyBL6uM7SFGqFzu3G8"
          , amount: funded
          }
        });
        */
        console.log("we did it!");
      } else {
        console.log("we have to refund :(");

        return (new Parse.Query("Attendee")).equalTo("partyid", party_id).find().then(function(attendees) {
          console.log(attendees);
          console.log(attendees.length);
        });
      }
    }, function() {
      response.error("Failed to load user for party " + party.id);  
    }).then(function(res) {
      response.success(res);  
    }, function(error) {
      response.error(error);
    });
  }, function() {
    response.error("Failed to load party");  
  });
});
