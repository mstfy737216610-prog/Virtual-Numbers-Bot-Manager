// BJS Library for SMS Providers
// Unified provider wrapper for 5sim and HeroSMS (improved for HeroSMS API)

var HERO_BASE = 'https://hero-sms.com/api/v1';

function getProviderRequest(site, action, params) {
  var api_key = params && params.api_key ? params.api_key : '';
  var url = '';
  var headers = {};

  if (site == '5sim') {
    headers = {
      Authorization: 'Bearer ' + api_key,
      Accept: 'application/json'
    };

    if (action == 'getNum') {
      url = 'https://5sim.net/v1/user/buy/activation/' + params.country + '/' + params.operator + '/' + params.app;
      return { url: url, headers: headers, method: 'GET' };
    }

    if (action == 'getStatus') {
      url = 'https://5sim.net/v1/user/check/' + params.idnumber;
      return { url: url, headers: headers, method: 'GET' };
    }

    if (action == 'getBalance') {
      url = 'https://5sim.net/v1/user/profile';
      return { url: url, headers: headers, method: 'GET' };
    }
  }

  if (site == 'herosms') {
    headers = {
      Authorization: 'ApiKey ' + api_key,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    if (action == 'getNum') {
      url = HERO_BASE + '/activations';
      var body = {
        service: params.app || params.service || 'tg',
        country: parseInt(params.country)
      };
      // include provider id if present
      if (params.provider_id) body.provider_id = params.provider_id;
      return { url: url, headers: headers, method: 'POST', body: JSON.stringify(body) };
    }

    if (action == 'getStatus') {
      // prefer activationId if provided
      if (params.activationId) {
        url = HERO_BASE + '/activations/' + params.activationId;
        return { url: url, headers: headers, method: 'GET' };
      }
      // fallback to list activations
      url = HERO_BASE + '/activations';
      return { url: url, headers: headers, method: 'GET' };
    }

    if (action == 'getBalance') {
      url = HERO_BASE + '/activations/stats';
      return { url: url, headers: headers, method: 'GET' };
    }
  }

  return null;
}

function httpRequest(request) {
  if (!request) return { ok: false, error: 'invalid_request' };
  try {
    var res = HTTP.request(request);
    // normalize common response shapes
    var body = res && res.body ? (typeof res.body === 'string' ? (function(){ try { return JSON.parse(res.body); } catch(e){ return res.body; } })() : res.body) : null;
    return { ok: true, status: res.status, data: body, raw: res };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

function buyNumber(site, params) {
  var request = getProviderRequest(site, 'getNum', params);
  if (!request) return { ok: false, error: 'Provider not supported' };
  var res = httpRequest(request);
  if (!res.ok) return res;
  // HeroSMS returns activation object inside data
  return res;
}

function checkNumberStatus(site, params) {
  var request = getProviderRequest(site, 'getStatus', params);
  if (!request) return { ok: false, error: 'Provider not supported' };
  var res = httpRequest(request);
  return res;
}

function getBalance(site, params) {
  var request = getProviderRequest(site, 'getBalance', params);
  if (!request) return { ok: false, error: 'Provider not supported' };
  var res = httpRequest(request);
  return res;
}

publish({
  getProviderRequest: getProviderRequest,
  buyNumber: buyNumber,
  checkNumberStatus: checkNumberStatus,
  getBalance: getBalance
});
