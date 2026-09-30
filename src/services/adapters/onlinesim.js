import ProviderAdapter from './base.js';
import fetch from 'node-fetch';

export default class OnlineSimAdapter extends ProviderAdapter {
  constructor(config = {}) {
    super(config);
    this.apiKey = config.api_key || process.env.ONLINESIM_API_KEY || '';
    this.baseUrl = config.base_url || 'https://onlinesim.io';
  }

  async getNumber({ app, country, operator }) {
    if (!this.apiKey) return { status: 0, message: 'no key' };
    try {
      const url = `${this.baseUrl}/api/getNum.php?apikey=${this.apiKey}&app=${app}&country=${country}`;
      const res = await fetch(url);
      const json = await res.json();
      // map fields
      return { status: json ? 200 : 0, idnumber: json.tzid || '', number: (json.number ? json.number : (json[0] && json[0].number) || ''), raw: json };
    } catch (e) {
      return { status: 0, message: e.message };
    }
  }

  async getStatus({ idnumber }) {
    if (!this.apiKey) return { status: 0 };
    try {
      const url = `${this.baseUrl}/api/getState.php?apikey=${this.apiKey}&tzid=${idnumber}`;
      const res = await fetch(url);
      const json = await res.json();
      const code = json && json[0] && json[0].msg ? json[0].msg : null;
      return { status: code ? 200 : 0, code, raw: json };
    } catch (e) {
      return { status: 0 };
    }
  }
}
