// BJS Library for SMS Providers
// Unified provider wrapper for 5sim and HeroSMS

function getProviderRequest(site, action, params) {
  var api_key = params && params.api_key ? params.api_key : "";
  var url = "";
  var headers = {};

  if (site == "5sim") {
    headers = {
      Authorization: "Bearer " + api_key,
      Accept: "application/json"
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
    headers = {
      Authorization: "ApiKey " + api_key,
      Accept: "application/json",
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
      url = "https://hero-sms.com/api/v1/activations";
      return { url: url, headers: headers, method: "GET" };
    }

    if (action == "getBalance") {
      url = "https://hero-sms.com/api/v1/activations/stats";
      return { url: url, headers: headers, method: "GET" };
    }
  }

  return null;
}

function safeJSONParse(s) {
  try { return JSON.parse(s); } catch (e) { return null; }
}

function httpRequest(request) {
  if (!request) return { ok: false, error: 'invalid_request' };
  try {
    var res = HTTP.request(request);
    return res;
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

function buyNumber(site, params) {
  var request = getProviderRequest(site, "getNum", params);
  if (!request) return { ok: false, error: "Provider not supported" };
  var res = httpRequest(request);
  return res;
}

function checkNumberStatus(site, params) {
  var request = getProviderRequest(site, "getStatus", params);
  if (!request) return { ok: false, error: "Provider not supported" };
  var res = httpRequest(request);
  return res;
}

function getBalance(site, params) {
  var request = getProviderRequest(site, "getBalance", params);
  if (!request) return { ok: false, error: "Provider not supported" };
  var res = httpRequest(request);
  return res;
}

publish({
  getProviderRequest: getProviderRequest,
  buyNumber: buyNumber,
  checkNumberStatus: checkNumberStatus,
  getBalance: getBalance
});
