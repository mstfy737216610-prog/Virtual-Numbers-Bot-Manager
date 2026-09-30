import ProviderAdapter from './base.js';
import fetch from 'node-fetch';

export default class FiveSimAdapter extends ProviderAdapter {
  constructor(config = {}) {
    super(config);
    this.apiKey = config.api_key || process.env.FIVESIM_API_KEY || '';
    this.baseUrl = config.base_url || 'https://5sim.biz';
  }

  async getNumber({ app, country, operator }) {
    if (!this.apiKey) {
      return { status: 0, message: 'No API key configured' };
    }
    try {
      const url = `${this.baseUrl}/v1/user/buy/activation/${country}/${operator}/${app}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${this.apiKey}`, Accept: 'application/json' } });
      const json = await res.json();
      return json || { status: 0 };
    } catch (e) {
      return { status: 0, message: e.message };
    }
  }

  async getStatus({ idnumber }) {
    if (!this.apiKey) return { status: 0 };
    try {
      const url = `${this.baseUrl}/v1/user/check/${idnumber}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${this.apiKey}`, Accept: 'application/json' } });
      const json = await res.json();
      // map to {status, code}
      if (json && json.sms && json.sms[0] && json.sms[0].code) {
        return { status: 200, code: json.sms[0].code };
      }
      return { status: 0 };
    } catch (e) {
      return { status: 0 };
    }
  }
}
