// BJS Library for SMS Providers
// Unified provider wrapper for 5sim, HeroSMS and Spark (uses similar HeroSMS-style endpoints)

var DEFAULT_HERO_BASE = 'https://hero-sms.com/api/v1';

function getProviderConfig(site) {
  var cfg = Bot.getProperty('config') || (function(){ try { var r = HTTP.get('https://raw.githubusercontent.com/mstfy737216610-prog/Virtual-Numbers-Bot-Manager/main/data/config.json'); return r && r.status==200 ? JSON.parse(r.body) : {}; } catch(e){ return {}; } })();
  return (cfg.providers && cfg.providers[site]) || {};
}

function getApiKeyFor(site, params) {
  // priority: params.api_key -> runtime config -> Bot env property -> empty
  if (params && params.api_key) return params.api_key;
  var pc = getProviderConfig(site);
  if (pc && pc.api_key) return pc.api_key;
  // Bot properties or environment-like keys (if deploy attaches them)
  var envKey = Bot.getProperty(site + '_api_key') || Bot.getProperty(site + '_API_KEY');
  if (envKey) return envKey;
  return '';
}

function getProviderRequest(site, action, params) {
  var pc = getProviderConfig(site);
  var api_key = getApiKeyFor(site, params) || '';
  var base = (pc && pc.base_url) || DEFAULT_HERO_BASE;
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

  // Hero-like providers: herosms, spark
  if (site == 'herosms' || site == 'spark') {
    headers = {
      Authorization: 'ApiKey ' + api_key,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    if (action == 'getNum') {
      url = base + '/activations';
      var body = {
        service: params.app || params.service || 'tg',
        country: parseInt(params.country)
      };
      if (params.provider_id) body.provider_id = params.provider_id;
      return { url: url, headers: headers, method: 'POST', body: JSON.stringify(body) };
    }

    if (action == 'getStatus') {
      if (params.activationId) {
        url = base + '/activations/' + params.activationId;
        return { url: url, headers: headers, method: 'GET' };
      }
      url = base + '/activations';
      return { url: url, headers: headers, method: 'GET' };
    }

    if (action == 'getBalance') {
      url = base + '/activations/stats';
      return { url: url, headers: headers, method: 'GET' };
    }
  }

  return null;
}

function httpRequest(request) {
  if (!request) return { ok: false, error: 'invalid_request' };
  try {
    var res = HTTP.request(request);
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
