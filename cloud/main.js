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
