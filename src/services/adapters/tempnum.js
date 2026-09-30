export default class TempNumAdapter {
  constructor(server = {}) {
    this.apiKey = server.api_key || process.env.TEMPNUM_API_KEY || '';
    this.base = server.base_url || 'https://tempnum.org/stubs/handler_api.php';
  }

  async fetchRaw(params) {
    const url = new URL(this.base);
    Object.keys(params).forEach(k => url.searchParams.append(k, params[k]));
    const res = await fetch(url.toString(), { method: 'GET' });
    const text = await res.text();
    return text;
  }

  async getNumber({ app, country, operator = 'any' } = {}) {
    try {
      const text = await this.fetchRaw({ api_key: this.apiKey, action: 'getNumber', service: app, country });
      // tempnum returns colon-separated values in many implementations: e.g. ACCESS:ID:NUMBER
      if (!text) return { status: 500, message: 'empty response' };
      const parts = text.split(':');
      // try to find id and number
      let id = parts[1] || null;
      let phone = parts[2] || parts[1] || null;
      // if only one token returned, treat it as number
      if (parts.length === 1) { phone = parts[0]; id = parts[0]; }
      return { status: 200, message: 'ok', number: phone || null, idnumber: id || null, raw: text };
    } catch (e) {
      return { status: 500, message: e.message };
    }
  }

  async getStatus({ idnumber, number } = {}) {
    try {
      if (!idnumber) return { status: 400, message: 'missing idnumber' };
      // many tempnum-like APIs expose getMessages or getStatus
      const text = await this.fetchRaw({ api_key: this.apiKey, action: 'getMessages', id: idnumber });
      if (!text) return { status: 204, message: 'no messages' };
      return { status: 200, message: 'ok', raw: text };
    } catch (e) {
      return { status: 500, message: e.message };
    }
  }
}
