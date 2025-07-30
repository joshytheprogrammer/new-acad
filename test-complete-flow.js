// Test to verify the complete attribution flow works correctly
console.log('=== TESTING FACEBOOK ATTRIBUTION DATA FLOW ===\n');

// Simulate the exact URL parameters from your Facebook ad
const fbAdUrl = 'https://academy.wandggroup.com/2025-summer-academy-surulere?campaign_id=120232171997590215&adset_id=120232465853060215&ad_id=120232465897720215&fbclid=PAQ0xDSwL2M_VleHRuA2FlbQEwAGFkaWQBqybKchtwNwGnXSFe8UQ6sS9LMggRD1clC2jpT_WvE76saqEK_cFW5e7fL47VLypfzLmxBQY_aem_5pNIedqVdD3KWCkAO5-r6w#enrollment';

// Extract parameters exactly as your getAttributionData function does
const url = new URL(fbAdUrl);
const urlParams = new URLSearchParams(url.search);

console.log('1. URL PARAMETERS EXTRACTED:');
console.log('   ad_id:', urlParams.get('ad_id'));
console.log('   adset_id:', urlParams.get('adset_id')); 
console.log('   campaign_id:', urlParams.get('campaign_id'));
console.log('   fbclid:', urlParams.get('fbclid'));
console.log('');

// Replicate your getAttributionData function logic
function testGetAttributionData() {
  const adIdStr = urlParams.get('ad_id');
  const adsetIdStr = urlParams.get('adset_id') || urlParams.get('adgroupid');
  const campaignIdStr = urlParams.get('campaign_id') || urlParams.get('campaignid');

  // Convert to numbers using BigInt and strip the 'n' suffix
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

  const ad_id = convertToMetaNumber(adIdStr);
  const adset_id = convertToMetaNumber(adsetIdStr);
  const campaign_id = convertToMetaNumber(campaignIdStr);

  return {
    ad_id,
    adset_id,
    campaign_id
  };
}

console.log('2. ATTRIBUTION DATA AFTER getAttributionData():');
const attributionData = testGetAttributionData();
console.log('   ad_id:', attributionData.ad_id, '(type:', typeof attributionData.ad_id, ')');
console.log('   adset_id:', attributionData.adset_id, '(type:', typeof attributionData.adset_id, ')');
console.log('   campaign_id:', attributionData.campaign_id, '(type:', typeof attributionData.campaign_id, ')');
console.log('');

// Test the server-side processing logic
console.log('3. SERVER-SIDE API PROCESSING:');
const processAttributionData = (eventData) => {
  const attributionData = {};
  
  if (eventData.attribution_data) {
    if (eventData.attribution_data.ad_id) {
      const adIdStr = String(eventData.attribution_data.ad_id);
      if (adIdStr.length <= 15) {
        attributionData.ad_id = Number(adIdStr);
      } else {
        attributionData.ad_id = adIdStr;
      }
    }
    if (eventData.attribution_data.adset_id) {
      const adsetIdStr = String(eventData.attribution_data.adset_id);
      if (adsetIdStr.length <= 15) {
        attributionData.adset_id = Number(adsetIdStr);
      } else {
        attributionData.adset_id = adsetIdStr;
      }
    }
    if (eventData.attribution_data.campaign_id) {
      const campaignIdStr = String(eventData.attribution_data.campaign_id);
      if (campaignIdStr.length <= 15) {
        attributionData.campaign_id = Number(campaignIdStr);
      } else {
        attributionData.campaign_id = campaignIdStr;
      }
    }
  }
  
  return attributionData;
};

// Simulate event data as it would be sent to the API
const mockEventData = {
  event_name: 'PageView',
  event_time: Math.floor(Date.now() / 1000),
  attribution_data: attributionData,
};

const processedAttribution = processAttributionData(mockEventData);
console.log('   After server processing:');
console.log('   ad_id:', processedAttribution.ad_id, '(type:', typeof processedAttribution.ad_id, ')');
console.log('   adset_id:', processedAttribution.adset_id, '(type:', typeof processedAttribution.adset_id, ')');
console.log('   campaign_id:', processedAttribution.campaign_id, '(type:', typeof processedAttribution.campaign_id, ')');
console.log('');

// Test Meta API payload format
console.log('4. FINAL META API PAYLOAD:');
const metaPayload = {
  data: [
    {
      event_name: 'PageView',
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_id: 'test-event-id',
      ...(Object.keys(processedAttribution).length > 0 && { attribution_data: processedAttribution }),
    }
  ],
};

console.log(JSON.stringify(metaPayload, null, 2));

// Verify no fbclid contamination
console.log('');
console.log('5. VERIFICATION CHECKS:');
console.log('   ✓ fbclid is NOT in attribution_data:', !metaPayload.data[0].attribution_data?.fbclid);
console.log('   ✓ ad_id is present:', !!metaPayload.data[0].attribution_data?.ad_id);
console.log('   ✓ ad_id is numeric:', typeof metaPayload.data[0].attribution_data?.ad_id === 'number');
console.log('   ✓ Expected ad_id value:', metaPayload.data[0].attribution_data?.ad_id === 120232465897720215);
