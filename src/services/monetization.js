/**
 * Monetizzazione:
 * - Versione gratuita con pubblicità NON personalizzata (banner + interstitial in momenti di pausa).
 *   Nessuna richiesta App Tracking Transparency: non tracciamo l'utente tra app di altre aziende.
 *   In SEE/UK chiediamo il consenso con il modulo certificato Google (UMP).
 * - AuraLift Premium: abbonamento auto-rinnovabile mensile o annuale, 7 giorni di prova gratuita
 *   (offerta introduttiva configurata su App Store Connect). Rimuove la pubblicità e sblocca le
 *   funzioni Premium.
 * - Gli ID AdMob reali arrivano dalle variabili VITE_ADMOB_* (Codemagic). Senza di esse si usano gli
 *   ID di test ufficiali Google: non pubblicare mai l'app con gli annunci di test.
 */
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { AdMob, AdmobConsentStatus, BannerAdPluginEvents, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { NativePurchases, PURCHASE_TYPE } from '@capgo/native-purchases';

export const PRODUCTS = {
  monthly: 'auralift.premium.monthly',
  yearly: 'auralift.premium.yearly'
};
const PRODUCT_IDS = Object.values(PRODUCTS);

const native = Capacitor.isNativePlatform();
const platform = Capacitor.getPlatform();
const env = import.meta.env;

const TEST_IDS = {
  ios: { banner: 'ca-app-pub-3940256099942544/2435281174', interstitial: 'ca-app-pub-3940256099942544/4411468910' },
  android: { banner: 'ca-app-pub-3940256099942544/9214589741', interstitial: 'ca-app-pub-3940256099942544/1033173712' }
};
const P = platform === 'ios' ? 'IOS' : 'ANDROID';
const REAL_IDS = { banner: env[`VITE_ADMOB_${P}_BANNER`], interstitial: env[`VITE_ADMOB_${P}_INTERSTITIAL`] };
const USE_TEST_ADS = env.DEV || !REAL_IDS.banner;
const AD_IDS = USE_TEST_ADS ? TEST_IDS[platform] || TEST_IDS.ios : REAL_IDS;

// Mai annunci a schermo intero durante l'allenamento: solo a fine sessione o ogni N cambi di sezione.
const NAV_EVERY = 6;
const MIN_GAP_MS = 3 * 60 * 1000;

const CACHE_KEY = 'auralift.premium';
const readCache = () => { try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || null; } catch { return null; } };
const writeCache = v => { try { localStorage.setItem(CACHE_KEY, JSON.stringify(v)); } catch { /* storage non disponibile */ } };

// Solo in sviluppo: ?premium simula l'abbonamento attivo, ?storeshot mostra il paywall come nell'app
const devFlags = env.DEV && typeof location !== 'undefined' ? location.search : '';
const cached = readCache();

let state = {
  native: native || devFlags.includes('storeshot'),
  isPremium: devFlags.includes('premium') || Boolean(cached && cached.expires > Date.now()),
  premiumInfo: cached,
  // Prezzi di esempio solo per l'anteprima del paywall in sviluppo; nell'app arrivano da StoreKit
  products: devFlags.includes('storeshot') ? {
    [PRODUCTS.monthly]: { identifier: PRODUCTS.monthly, price: 6.99, priceString: '6,99 €', currencyCode: 'EUR' },
    [PRODUCTS.yearly]: { identifier: PRODUCTS.yearly, price: 39.99, priceString: '39,99 €', currencyCode: 'EUR' }
  } : {},
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

// ---------------------------------------------------------------- abbonamento
function activeSubscription(purchases) {
  const now = Date.now();
  return (purchases || []).find(p => PRODUCT_IDS.includes(p.productIdentifier) &&
    (p.isActive === true || (p.expirationDate && new Date(p.expirationDate).getTime() > now)));
}

async function applyPurchases(purchases) {
  const sub = activeSubscription(purchases);
  const info = sub ? {
    productId: sub.productIdentifier,
    // Senza data di scadenza teniamo valida la cache 1 giorno: verrà riverificata al prossimo avvio
    expires: sub.expirationDate ? new Date(sub.expirationDate).getTime() : Date.now() + 86400000,
    trial: Boolean(sub.isTrialPeriod),
    willCancel: sub.willCancel === true
  } : null;
  writeCache(info);
  setState({ isPremium: Boolean(info), premiumInfo: info });
  if (info) await removeAds();
}

export async function refreshPremium() {
  if (!native) return;
  try {
    const { purchases } = await NativePurchases.getPurchases({ productType: PURCHASE_TYPE.SUBS, onlyCurrentEntitlements: true });
    await applyPurchases(purchases);
  } catch (err) {
    // Offline: resta valido l'ultimo stato noto fino alla sua scadenza
    console.info('Verifica abbonamento non riuscita', err);
  }
}

export async function loadProducts() {
  if (!native) return;
  try {
    const { products } = await NativePurchases.getProducts({ productIdentifiers: PRODUCT_IDS, productType: PURCHASE_TYPE.SUBS });
    setState({ products: Object.fromEntries(products.map(p => [p.identifier, p])) });
  } catch (err) {
    console.info('Prodotti non disponibili', err);
  }
}

export async function buyPremium(productId) {
  if (!native) throw new Error('store_unavailable');
  const product = state.products[productId];
  await NativePurchases.purchaseProduct({
    productIdentifier: productId,
    productType: PURCHASE_TYPE.SUBS,
    planIdentifier: product?.planIdentifier
  });
  await refreshPremium();
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
let showing = false;

const adsAllowed = () => native && state.adsReady && !state.isPremium;

async function prepareInterstitial() {
  try {
    await AdMob.prepareInterstitial({ adId: AD_IDS.interstitial, isTesting: USE_TEST_ADS, npa: true });
    interstitialLoaded = true;
  } catch {
    interstitialLoaded = false;
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

async function showInterstitial() {
  if (!adsAllowed() || showing) return;
  if (Date.now() - lastFullscreenAt < MIN_GAP_MS) return;
  if (!interstitialLoaded) {
    prepareInterstitial();
    return;
  }
  try {
    showing = true;
    interstitialLoaded = false;
    await AdMob.showInterstitial();
    lastFullscreenAt = Date.now();
  } catch {
    // annuncio non disponibile
  } finally {
    showing = false;
    prepareInterstitial();
  }
}

/** Dopo il riepilogo di fine allenamento. */
export const adAfterWorkout = () => showInterstitial();

/** A ogni cambio di sezione (mai durante una sessione attiva: lo decide il chiamante). */
export function adOnNavigate() {
  navCount += 1;
  if (navCount % NAV_EVERY === 0) showInterstitial();
}

/** Durante l'allenamento il banner resta (non copre i comandi), gli altri annunci no. */
export async function initMonetization() {
  setState({});
  if (!native) return;
  loadProducts();
  await Promise.race([refreshPremium(), sleep(4000)]);
  CapApp.addListener('appStateChange', ({ isActive }) => { if (isActive) refreshPremium(); });
  if (state.isPremium) return;

  if (!(await gatherConsent())) return;
  await AdMob.initialize({ initializeForTesting: USE_TEST_ADS });
  setState({ adsReady: true });
  AdMob.addListener(BannerAdPluginEvents.SizeChanged, size => setState({ bannerHeight: size.height || 0 }));
  showBanner();
  prepareInterstitial();
  // L'utente appena arrivato non vede annunci a schermo intero per i primi minuti
  lastFullscreenAt = Date.now();
}
