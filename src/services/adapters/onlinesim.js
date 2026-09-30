export default class OnlineSimAdapter {
  constructor(server = {}) {
    this.apiKey = server.api_key || process.env.ONLINESIM_API_KEY || '';
    this.base = (server.base_url || 'https://onlinesim.io').replace(/\/$/, '');
  }

  async getJson(url) {
    const res = await fetch(url, { method: 'GET' });
    const text = await res.text();
    try { return JSON.parse(text); } catch (e) { return null; }
  }

  async getNumber({ app, country, operator = 'any' } = {}) {
    try {
      const url = `${this.base}/api/getNum.php?apikey=${encodeURIComponent(this.apiKey)}&app=${encodeURIComponent(app)}&country=${encodeURIComponent(country)}`;
      const api = await this.getJson(url);
      // API returns tzid in many variants
      const id = api?.tzid || api?.id || (api && api[0] && api[0].tzid) || null;
      let number = null;
      if (id) {
        const st = await this.getJson(`${this.base}/api/getState.php?apikey=${encodeURIComponent(this.apiKey)}&tzid=${encodeURIComponent(id)}`);
        number = st && st[0] && st[0].number ? st[0].number : (st && st.number) || null;
      }
      return { status: 200, message: 'ok', number, idnumber: id, raw: { api, state: number ? true : null } };
    } catch (e) {
      return { status: 500, message: e.message };
    }
  }

  async getStatus({ idnumber, number } = {}) {
    try {
      if (!idnumber) return { status: 400, message: 'missing idnumber' };
      const st = await this.getJson(`${this.base}/api/getState.php?apikey=${encodeURIComponent(this.apiKey)}&tzid=${encodeURIComponent(idnumber)}`);
      // try to extract sms/code
      const code = (st && st[0] && st[0].sms) || (st && st.sms) || null;
      return { status: 200, message: 'ok', code, raw: st };
    } catch (e) {
      return { status: 500, message: e.message };
    }
  }
}
