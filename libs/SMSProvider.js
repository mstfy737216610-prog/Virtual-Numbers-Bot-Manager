// BJS Library for SMS Providers
// Integrated with 5sim.net API

function getProviderRequest(site, action, params) {
  var api_key = params.api_key;
  var url = "";
  
  if (site == "5sim") {
    // 5sim using JWT Authentication in Headers
    var headers = {
      "Authorization": "Bearer " + api_key,
      "Accept": "application/json"
    };

    if (action == "getNum") {
      url = "https://5sim.net/v1/user/buy/activation/" + params.country + "/" + params.operator + "/" + params.app;
      return { url: url, headers: headers, method: "GET" };
    }
    
    if (action == "getStatus") {
      url = "https://5sim.net/v1/user/check/" + params.idnumber;
      return { url: url, headers: headers, method: "GET" };
    }

    if (action == "getBalance") {
      url = "https://5sim.net/v1/user/profile";
      return { url: url, headers: headers, method: "GET" };
    }
  }

  if (site == "herosms") {
    // Hero-SMS REST API v1
    var headers = {
      "Authorization": "ApiKey " + api_key,
      "Accept": "application/json",
      "Content-Type": "application/json"
    };

    if (action == "getNum") {
      url = "https://hero-sms.com/api/v1/activations";
      var body = {
        service: params.app,
        country: parseInt(params.country)
      };
      return { url: url, headers: headers, method: "POST", body: JSON.stringify(body) };
    }

    if (action == "getStatus") {
      url = "https://hero-sms.com/api/v1/activations"; // This usually returns active activations
      return { url: url, headers: headers, method: "GET" };
    }
    
    if (action == "getBalance") {
      url = "https://hero-sms.com/api/v1/activations/stats"; // Using stats for balance/usage
      return { url: url, headers: headers, method: "GET" };
    }
  }
  
  return null;
}

publish({
  getProviderRequest: getProviderRequest
});
