export default class ProviderAdapter {
  constructor(config = {}) {
    this.config = config || {};
  }

  async getNumber(opts = {}) {
    throw new Error('getNumber not implemented');
  }

  async getStatus(opts = {}) {
    throw new Error('getStatus not implemented');
  }

  async setStatus(opts = {}) {
    throw new Error('setStatus not implemented');
  }

  async addBlack(opts = {}) {
    throw new Error('addBlack not implemented');
  }

  async getPrice(opts = {}) {
    throw new Error('getPrice not implemented');
  }
}
