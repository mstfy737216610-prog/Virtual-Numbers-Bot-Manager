import db from '../db/index.js';
import { getProviders, getAppsByProvider, getPriceFor, buildDemoNumberResponse } from './providerRegistry.js';

export function getProviderList() {
  return getProviders();
}

export function getApps(providerCode) {
  return getAppsByProvider(providerCode);
}

export function getPrice(providerCode, appCode, countryCode, operator) {
  return getPriceFor(providerCode, appCode, countryCode, operator);
}

export async function createDemoOrder(userTelegramId, providerCode, appCode, countryCode, operator) {
  // wrapper to mimic external order
  const resp = buildDemoNumberResponse({ countryCode, appCode, providerCode });
  return resp;
}
