import ProviderAdapter from './base.js';
import fetch from 'node-fetch';

export default class TempNumAdapter extends ProviderAdapter {
  constructor(config = {}) {
    super(config);
    this.apiKey = config.api_key || process.env.TEMPNUM_API_KEY || '';
    this.baseUrl = config.base_url || 'https://tempnum.org';
  }

  async getNumber({ app, country, operator }) {
    if (!this.apiKey) return { status: 0, message: 'no key' };
    try {
      const url = `${this.baseUrl}/stubs/handler_api.php?api_key=${this.apiKey}&action=getNumber&service=${app}&country=${country}`;
      const res = await fetch(url);
      const text = await res.text();
      // format: ACCESS_NUMBER:ID:NUMBER
      const parts = text.split(':');
      return { status: res.ok ? 200 : 0, idnumber: parts[1] || '', number: parts[2] || '', raw: text };
    } catch (e) {
      return { status: 0, message: e.message };
    }
  }

  async getStatus({ idnumber }) {
    if (!this.apiKey) return { status: 0 };
    try {
      const url = `${this.baseUrl}/stubs/handler_api.php?action=getStatus&api_key=${this.apiKey}&id=${idnumber}`;
      const res = await fetch(url);
      const text = await res.text();
      const parts = text.split(':');
      return { status: text ? 200 : 0, code: parts[1] || null, raw: text };
    } catch (e) {
      return { status: 0 };
    }
  }
}
