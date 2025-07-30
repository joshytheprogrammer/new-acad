import crypto from 'crypto';

/**
 * Generates a unique event ID for deduplication between Pixel and Conversions API
 * Uses browser-compatible UUID generation
 */
export function generateEventId(): string {
  // Check if we're in browser environment and crypto.randomUUID is available
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  
  // Fallback for Node.js environment
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback UUID v4 generation for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Gets the _fbp cookie (Facebook browser ID) from the browser
 */
export function getFbp(): string | null {
  if (typeof window === 'undefined') return null;
  
  const fbp = document.cookie
    .split(';')
    .find(cookie => cookie.trim().startsWith('_fbp='));
  
  return fbp ? fbp.split('=')[1] : null;
}

/**
 * Gets the _fbc cookie (Facebook click ID) from the browser
 */
export function getFbc(): string | null {
  if (typeof window === 'undefined') return null;
  
  const fbc = document.cookie
    .split(';')
    .find(cookie => cookie.trim().startsWith('_fbc='));
  
  return fbc ? fbc.split('=')[1] : null;
}

/**
 * Generates Facebook click ID (fbc) from fbclid URL parameter
 * Format: fb.1.{timestamp}.{fbclid}
 */
export function generateFbcFromFbclid(fbclid: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  return `fb.1.${timestamp}.${fbclid}`;
}

/**
 * Gets Facebook click ID from URL parameter or cookie
 */
export function getFbcFromUrlOrCookie(): string | null {
  if (typeof window === 'undefined') return null;
  
  // First try to get from cookie
  const cookieFbc = getFbc();
  if (cookieFbc) return cookieFbc;
  
  // If no cookie, try to get fbclid from URL and generate fbc
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get('fbclid');
  
  if (fbclid) {
    return generateFbcFromFbclid(fbclid);
  }
  
  return null;
}

/**
 * Hashes a string using SHA-256 for privacy compliance
 * Works in both browser and Node.js environments
 */
export async function hashString(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.toLowerCase().trim());
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    // Browser environment
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Node.js environment (for server-side)
    const crypto = await import('crypto');
    return crypto.createHash('sha256').update(input.toLowerCase().trim()).digest('hex');
  }
}

/**
 * Synchronous hash function for Node.js environment (server-side only)
 */
export function hashStringSync(input: string): string {
  if (typeof window !== 'undefined') {
    throw new Error('hashStringSync should only be used server-side');
  }
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(input.toLowerCase().trim()).digest('hex');
}


export function getAttributionData() {
  if (typeof window === 'undefined') {
    return { 
      ad_id: null, 
      adset_id: null, 
      campaign_id: null,
    };
  }

  const urlParams = new URLSearchParams(window.location.search);

  const adIdStr = urlParams.get('ad_id');
  const adsetIdStr = urlParams.get('adset_id') || urlParams.get('adgroupid');
  const campaignIdStr = urlParams.get('campaign_id') || urlParams.get('campaignid');

  // Convert to numbers using BigInt and strip the 'n' suffix
  const convertToMetaNumber = (str: string | null) => {
    if (!str) return null;
    try {
      const bigIntVal = BigInt(str);
      return bigIntVal.toString(); // Meta accepts number-like string
    } catch (e) {
      console.warn(`Invalid attribution ID: ${str}`);
      return null;
    }
  };

  const ad_id = convertToMetaNumber(adIdStr);
  const adset_id = convertToMetaNumber(adsetIdStr);
  const campaign_id = convertToMetaNumber(campaignIdStr);


  return {
    ad_id,
    adset_id,
    campaign_id
  };
}

export function getBrowserData() {
  if (typeof window === 'undefined') {
    return {
      userAgent: '',
      fbp: null,
      fbc: null,
      sourceUrl: ''
    };
  }

  return {
    userAgent: navigator.userAgent,
    fbp: getFbp(),
    fbc: getFbcFromUrlOrCookie(),
    sourceUrl: window.location.href
  };
}

/**
 * Creates user data object for Meta Conversions API
 */
export async function createUserData(email: string, phone?: string, clientIp?: string, userAgent?: string) {
  const userData: any = {
    em: await hashString(email),
    client_user_agent: userAgent,
    client_ip_address: clientIp,
  };

  if (phone) {
    // Remove any non-numeric characters and add country code if missing
    const cleanPhone = phone.replace(/\D/g, '');
    const phoneWithCountryCode = cleanPhone.startsWith('234') ? cleanPhone : `234${cleanPhone.replace(/^0/, '')}`;
    userData.ph = await hashString(phoneWithCountryCode);
  }

  const browserData = getBrowserData();
  if (browserData.fbp) userData.fbp = browserData.fbp;
  if (browserData.fbc) userData.fbc = browserData.fbc;

  return userData;
}

/**
 * Tracks a Meta Pixel event on the frontend
 */
export function trackPixelEvent(eventName: string, eventData: any = {}, eventId?: string) {
  if (typeof window === 'undefined' || !window.fbq) return;

  const trackingData = { ...eventData };
  const options: any = {};

  if (eventId) {
    options.eventID = eventId;
  }

  window.fbq('track', eventName, trackingData, options);
}

/**
 * Gets client IP address
 */
export async function getClientIp(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return '';
  }
}

// Types for Meta events
export interface LeadData {
  email: string;
  name: string;
  phone: string;
  eventId: string;
  fbp: string | null;
  fbc: string | null;
  userAgent: string;
  clientIp: string;
  sourceUrl: string;
  timestamp: string;
}

export interface MetaEventData {
  event_name: string;
  event_time: number;
  user_data: any;
  custom_data?: any;
  event_source_url: string;
  event_id: string;
}

// Declare fbq for TypeScript
declare global {
  interface Window {
    fbq: any;
    crypto: Crypto & {
      randomUUID?: () => string;
    };
  }
} 