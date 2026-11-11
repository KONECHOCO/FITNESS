/**
 * Monetizzazione:
 * - Versione gratuita con pubblicità NON personalizzata: video all'apertura dell'app (app open, con
 *   interstitial di riserva), banner fisso e interstitial nelle pause naturali. Mai annunci a schermo
 *   intero durante un allenamento (lo decide il chiamante). Nessuna richiesta App Tracking Transparency.
 *   In SEE/UK chiediamo il consenso con il modulo certificato Google (UMP).
 * - AuraLift Pro: acquisto UNA TANTUM (non consumabile, 3,99 €). Toglie tutta la pubblicità e sblocca
 *   le funzioni Pro. Chi aveva già un abbonamento Premium (versione 1.0) mantiene tutto sbloccato.
 * - Gli ID AdMob reali arrivano da .env.production. Senza di essi si usano gli ID di test ufficiali Google.
 */
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import {
  AdMob, AdmobConsentStatus, AppOpenAdPluginEvents, BannerAdPluginEvents, BannerAdPosition, BannerAdSize
} from '@capacitor-community/admob';
import { NativePurchases, PURCHASE_TYPE } from '@capgo/native-purchases';

export const PRO_PRODUCT_ID = 'auralift_pro';
// Abbonamenti della versione 1.0, non più in vendita nell'app ma ancora validi per chi li ha
const LEGACY_SUBS = ['auralift.premium.monthly', 'auralift.premium.yearly'];

const native = Capacitor.isNativePlatform();
const platform = Capacitor.getPlatform();
const env = import.meta.env;

const TEST_IDS = {
  ios: {
    banner: 'ca-app-pub-3940256099942544/2435281174',
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    appOpen: 'ca-app-pub-3940256099942544/5575463023'
  },
  android: {
    banner: 'ca-app-pub-3940256099942544/9214589741',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    appOpen: 'ca-app-pub-3940256099942544/9257395921'
  }
};
const P = platform === 'ios' ? 'IOS' : 'ANDROID';
const REAL_IDS = {
  banner: env[`VITE_ADMOB_${P}_BANNER`],
  interstitial: env[`VITE_ADMOB_${P}_INTERSTITIAL`],
  appOpen: env[`VITE_ADMOB_${P}_APP_OPEN`]
};
const USE_TEST_ADS = env.DEV || !REAL_IDS.banner;
const AD_IDS = USE_TEST_ADS ? TEST_IDS[platform] || TEST_IDS.ios : REAL_IDS;

// Frequenze: entro le regole AdMob (niente annunci a raffica, mai durante l'uso attivo)
const NAV_EVERY = 3;
const MIN_GAP_MS = 60 * 1000;
const APP_OPEN_MIN_BACKGROUND_MS = 20 * 1000;
const APP_OPEN_LOAD_TIMEOUT_MS = 6000;

const CACHE_KEY = 'auralift.pro';
const readCache = () => { try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || null; } catch { return null; } };
const writeCache = v => { try { localStorage.setItem(CACHE_KEY, JSON.stringify(v)); } catch { /* storage non disponibile */ } };

// Solo in sviluppo: ?premium simula Pro attivo, ?storeshot mostra il paywall come nell'app
const devFlags = env.DEV && typeof location !== 'undefined' ? location.search : '';
const cached = readCache();

let state = {
  native: native || devFlags.includes('storeshot'),
  isPremium: devFlags.includes('premium') || Boolean(cached && (cached.lifetime || cached.expires > Date.now())),
  premiumInfo: cached,
  // Prezzo di esempio solo per l'anteprima del paywall in sviluppo; nell'app arriva da StoreKit
  products: devFlags.includes('storeshot')
    ? { [PRO_PRODUCT_ID]: { identifier: PRO_PRODUCT_ID, price: 3.99, priceString: '3,99 €', currencyCode: 'EUR' } }
    : {},
  adsReady: false,
  bannerHeight: 0
};
const listeners = new Set();
function setState(patch) {
  state = { ...state, ...patch };
  document.documentElement.style.setProperty('--ad-h', `${state.isPremium ? 0 : state.bannerHeight}px`);
  listeners.forEach(l => l(state));
}
export const getMonetization = () => state;
export function onMonetization(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---------------------------------------------------------------- Pro (e vecchi abbonamenti)
async function applyEntitlements(inapp, subs) {
  const pro = (inapp || []).find(p => p.productIdentifier === PRO_PRODUCT_ID &&
    (platform !== 'android' || p.purchaseState === '1' || p.purchaseState == null));
  const now = Date.now();
  const sub = (subs || []).find(p => LEGACY_SUBS.includes(p.productIdentifier) &&
    (p.isActive === true || (p.expirationDate && new Date(p.expirationDate).getTime() > now)));
  let info = null;
  if (pro) info = { productId: PRO_PRODUCT_ID, lifetime: true };
  else if (sub) {
    info = {
      productId: sub.productIdentifier,
      expires: sub.expirationDate ? new Date(sub.expirationDate).getTime() : now + 86400000,
      willCancel: sub.willCancel === true,
      legacySub: true
    };
  }
  writeCache(info);
  setState({ isPremium: Boolean(info), premiumInfo: info });
  if (info) await removeAds();
}

export async function refreshPremium() {
  if (!native) return;
  try {
    const [inapp, subs] = await Promise.all([
      NativePurchases.getPurchases({ productType: PURCHASE_TYPE.INAPP }).then(r => r.purchases).catch(() => []),
      NativePurchases.getPurchases({ productType: PURCHASE_TYPE.SUBS, onlyCurrentEntitlements: true }).then(r => r.purchases).catch(() => [])
    ]);
    await applyEntitlements(inapp, subs);
  } catch (err) {
    // Offline: resta valido l'ultimo stato noto
    console.info('Verifica acquisti non riuscita', err);
  }
}

export async function loadProducts() {
  if (!native) return;
  try {
    const { product } = await NativePurchases.getProduct({ productIdentifier: PRO_PRODUCT_ID, productType: PURCHASE_TYPE.INAPP });
    if (product) setState({ products: { [PRO_PRODUCT_ID]: product } });
  } catch (err) {
    console.info('Prodotto Pro non disponibile', err);
  }
}

export async function buyPremium() {
  if (!native) throw new Error('store_unavailable');
  const tx = await NativePurchases.purchaseProduct({ productIdentifier: PRO_PRODUCT_ID, productType: PURCHASE_TYPE.INAPP, quantity: 1 });
  if (tx?.productIdentifier === PRO_PRODUCT_ID) await applyEntitlements([tx], []);
  else await refreshPremium();
  return state.isPremium;
}

export async function restorePremium() {
  if (!native) return false;
  try {
    await NativePurchases.restorePurchases();
  } catch {
    // proseguiamo comunque con la lettura degli acquisti
  }
  await refreshPremium();
  return state.isPremium;
}

export async function manageSubscription() {
  if (native) await NativePurchases.manageSubscriptions();
}

// ---------------------------------------------------------------- pubblicità
let lastFullscreenAt = 0;
let navCount = 0;
let interstitialLoaded = false;
let appOpenLoaded = false;
let showing = false;
let backgroundedAt = 0;
let blockFullscreen = () => false;

const adsAllowed = () => native && state.adsReady && !state.isPremium;

async function prepareInterstitial() {
  try {
    await AdMob.prepareInterstitial({ adId: AD_IDS.interstitial, isTesting: USE_TEST_ADS, npa: true });
    interstitialLoaded = true;
  } catch {
    interstitialLoaded = false;
  }
}

async function loadAppOpen() {
  if (!AD_IDS.appOpen) return;
  try {
    await AdMob.loadAppOpen({ adId: AD_IDS.appOpen, npa: true });
    appOpenLoaded = true;
  } catch {
    appOpenLoaded = false;
  }
}

async function showBanner() {
  if (!adsAllowed()) return;
  try {
    await AdMob.showBanner({
      adId: AD_IDS.banner,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: USE_TEST_ADS,
      npa: true
    });
  } catch (err) {
    console.info('Banner non disponibile', err);
  }
}

async function removeAds() {
  if (!native) return;
  try {
    await AdMob.removeBanner();
  } catch {
    // nessun banner attivo
  }
  setState({ bannerHeight: 0 });
}

async function gatherConsent() {
  try {
    let info = await Promise.race([AdMob.requestConsentInfo(), sleep(10000).then(() => { throw new Error('UMP timeout'); })]);
    if (info.isConsentFormAvailable && info.status === AdmobConsentStatus.REQUIRED) info = await AdMob.showConsentForm();
    setState({ privacyOptions: info.privacyOptionsRequirementStatus === 'REQUIRED' });
    return info.canRequestAds !== false;
  } catch (err) {
    console.info('Consenso UMP non disponibile', err);
    return true;
  }
}

export async function showPrivacyOptions() {
  if (native) await AdMob.showPrivacyOptionsForm();
}

async function showInterstitial(force = false) {
  if (!adsAllowed() || showing || blockFullscreen()) return false;
  if (!force && Date.now() - lastFullscreenAt < MIN_GAP_MS) return false;
  if (!interstitialLoaded) {
    prepareInterstitial();
    return false;
  }
  try {
    showing = true;
    interstitialLoaded = false;
    await AdMob.showInterstitial();
    lastFullscreenAt = Date.now();
    return true;
  } catch {
    return false;
  } finally {
    showing = false;
    prepareInterstitial();
  }
}

/** Video all'apertura: app open se pronto entro pochi secondi, altrimenti interstitial di riserva. */
async function showOpeningAd() {
  if (!adsAllowed() || showing || blockFullscreen()) return;
  if (!appOpenLoaded) await Promise.race([loadAppOpen(), sleep(APP_OPEN_LOAD_TIMEOUT_MS)]);
  if (appOpenLoaded) {
    try {
      showing = true;
      appOpenLoaded = false;
      await AdMob.showAppOpen();
      lastFullscreenAt = Date.now();
      return;
    } catch {
      showing = false;
    }
  }
  if (!interstitialLoaded) await Promise.race([prepareInterstitial(), sleep(APP_OPEN_LOAD_TIMEOUT_MS)]);
  await showInterstitial(true);
}

/** Dopo il riepilogo di fine allenamento. */
export const adAfterWorkout = () => showInterstitial();

/** A ogni cambio di sezione (mai durante una sessione attiva: lo decide il chiamante). */
export function adOnNavigate() {
  navCount += 1;
  if (navCount % NAV_EVERY === 0) showInterstitial();
}

/**
 * Da chiamare una volta all'avvio. `opts.shouldBlockFullscreen()` deve restituire true quando un annuncio
 * a schermo intero darebbe fastidio (primo avvio/onboarding, allenamento in corso).
 */
export async function initMonetization(opts = {}) {
  if (opts.shouldBlockFullscreen) blockFullscreen = opts.shouldBlockFullscreen;
  setState({});
  if (!native) return;
  loadProducts();
  await Promise.race([refreshPremium(), sleep(4000)]);
  CapApp.addListener('appStateChange', ({ isActive }) => {
    if (!isActive) {
      backgroundedAt = Date.now();
      return;
    }
    refreshPremium();
    const away = backgroundedAt ? Date.now() - backgroundedAt : 0;
    if (away >= APP_OPEN_MIN_BACKGROUND_MS && Date.now() - lastFullscreenAt >= MIN_GAP_MS) showOpeningAd();
  });
  if (state.isPremium) return;

  if (!(await gatherConsent())) return;
  await AdMob.initialize({ initializeForTesting: USE_TEST_ADS });
  setState({ adsReady: true });
  AdMob.addListener(BannerAdPluginEvents.SizeChanged, size => setState({ bannerHeight: size.height || 0 }));
  AdMob.addListener(AppOpenAdPluginEvents.Closed, () => {
    showing = false;
    lastFullscreenAt = Date.now();
    loadAppOpen();
  });
  AdMob.addListener(AppOpenAdPluginEvents.FailedToShow, () => {
    showing = false;
    loadAppOpen();
  });
  prepareInterstitial();
  await showOpeningAd();
  showBanner();
  loadAppOpen();
}
