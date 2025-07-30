// Test script to verify attribution data extraction
const testUrl = 'http://localhost:3000/2025-summer-academy-surulere?campaign_id=120232171997590215&adset_id=120232465853060215&ad_id=120232465897720215&fbclid=PAQ0xDSwL2M_VleHRuA2FlbQEwAGFkaWQBqybKchtwNwGnXSFe8UQ6sS9LMggRD1clC2jpT_WvE76saqEK_cFW5e7fL47VLypfzLmxBQY_aem_5pNIedqVdD3KWCkAO5-r6w';

// Extract URL parameters
const url = new URL(testUrl);
const urlParams = new URLSearchParams(url.search);

console.log('URL Parameters extracted:');
console.log('ad_id:', urlParams.get('ad_id'));
console.log('adset_id:', urlParams.get('adset_id')); 
console.log('campaign_id:', urlParams.get('campaign_id'));
console.log('fbclid:', urlParams.get('fbclid'));

// Test the convertToMetaNumber function logic from your code
const convertToMetaNumber = (str) => {
  if (!str) return null;
  try {
    const bigIntVal = BigInt(str);
    return bigIntVal.toString(); // Meta accepts number-like string
  } catch (e) {
    console.warn(`Invalid attribution ID: ${str}`);
    return null;
  }
};

console.log('\nConverted values:');
console.log('ad_id converted:', convertToMetaNumber(urlParams.get('ad_id')));
console.log('adset_id converted:', convertToMetaNumber(urlParams.get('adset_id')));
console.log('campaign_id converted:', convertToMetaNumber(urlParams.get('campaign_id')));

// Simulate what getAttributionData() would return
const attributionData = {
  ad_id: convertToMetaNumber(urlParams.get('ad_id')),
  adset_id: convertToMetaNumber(urlParams.get('adset_id')),
  campaign_id: convertToMetaNumber(urlParams.get('campaign_id'))
};

console.log('\nFinal attribution data object:');
console.log(JSON.stringify(attributionData, null, 2));

// Check data types
console.log('\nData types:');
console.log('ad_id type:', typeof attributionData.ad_id);
console.log('adset_id type:', typeof attributionData.adset_id);
console.log('campaign_id type:', typeof attributionData.campaign_id);
