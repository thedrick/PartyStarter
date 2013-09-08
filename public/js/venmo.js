var Venmo = (function (Venmo) {
  Venmo.auth = function() {
    var options = {
      client_id: "1353"
    , scope: "access_profile,make_payments"
    , response_type: "code"
    };
    var endpoint = "https://api.venmo.com/oauth/authorize?";
    
    window.location = endpoint + $.param(options);
  };

  Venmo.pay = function(recipient, amount, note) {
    var user = Parse.User.current();

    if (!user) {
      $.ajax({
        type: 'POST'
      , url: "https://api.venmo.com/payments"
      , data: {
          note: note
        , email: recipient
        , access_token: user.get('venmo_token')
        , amount: amount
        }
      }).then(function(response) {
        console.log(response);
      });
    } else {
      throw new Error("Cannot pay through Venmo without a current user (and a Venmo token)");
    }
  };

	return Venmo;
}(Venmo || {}));
