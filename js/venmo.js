var Venmo = (function (Venmo) {

  Venmo.auth = function() {
    var options = {
      client_id: "1353"
    , scope: "access_profile,make_payments"
    , response_type: "token"
    };
    var endpoint = "https://api.venmo.com/oauth/authorize?";
    
    window.location = endpoint + $.param(options);
  };

	return Venmo;
}(Venmo || {}));
