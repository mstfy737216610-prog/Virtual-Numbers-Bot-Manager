export default class FiveSimAdapter {
  constructor(server = {}) {
    this.apiKey = server.api_key || process.env.FIVESIM_API_KEY || '';
    this.base = (server.base_url || 'https://5sim.net').replace(/\/$/, '');
  }

  async request(url, opts = {}) {
    const headers = Object.assign({}, opts.headers || {}, this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {});
    const res = await fetch(url, Object.assign({}, opts, { headers }));
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch (e) { json = null; }
    return { ok: res.ok, status: res.status, json, text };
  }

  async getNumber({ app, country, operator = 'any' } = {}) {
    try {
      const url = `${this.base}/v1/user/buy/activation/${encodeURIComponent(country)}/${encodeURIComponent(operator)}/${encodeURIComponent(app)}`;
      const r = await this.request(url, { method: 'GET' });
      if (!r.ok) return { status: r.status || 500, message: r.text || 'error' };
      const api = r.json;
      // typical 5sim response contains id and phone
      const id = api?.id || api?.order_id || api?.activationId || api?.tzid || null;
      const phone = api?.phone || api?.number || api?.phoneNumber || null;
      const expires = api?.expires || api?.expiration || null;
      return {
        status: 200,
        message: 'ok',
        number: phone,
        idnumber: id,
        expires,
        raw: api
      };
    } catch (e) {
      return { status: 500, message: e.message };
    }
  }

  async getStatus({ idnumber, number } = {}) {
    if (!idnumber) return { status: 400, message: 'missing idnumber' };
    try {
      const url = `${this.base}/v1/user/check/activation/${encodeURIComponent(idnumber)}`;
      const r = await this.request(url, { method: 'GET' });
      if (!r.ok) return { status: r.status || 500, message: r.text || 'error' };
      const api = r.json;
      // Map known fields
      return {
        status: 200,
        message: 'ok',
        code: api?.code || api?.sms || null,
        raw: api
      };
    } catch (e) {
      return { status: 500, message: e.message };
    }
  }
}
