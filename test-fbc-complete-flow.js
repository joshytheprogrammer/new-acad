// Test script to simulate the complete fbc data flow as it happens in the app
console.log('=== TESTING COMPLETE FBC DATA FLOW ===\n');

// 1. Simulate URL with fbclid (as would come from Facebook ad)
const fbAdUrl = 'http://localhost:3000/2025-summer-academy-surulere?campaign_id=120232171987590215&adset_id=125632465853060215&ad_id=124532465897720215&fbclid=PAQ0xDSwL2M_VleHRbW2FlbQEwAGFkaWQBqybKchtwNwGnXSFe8UQ6sS9LMggRD1clC2jpT_WvE76saqEK_cFW5e7fL47VLypfzLmxBQY_aem_5pNIedqVdD3KWCkAO5-r6w#enrollment';

console.log('1. ORIGINAL URL:');
console.log('   URL:', fbAdUrl);

// 2. Extract fbclid via URLSearchParams (same as getFbcFromUrlOrCookie)
const url = new URL(fbAdUrl);
const urlParams = new URLSearchParams(url.search);
const originalFbclid = urlParams.get('fbclid');

console.log('\n2. FBCLID EXTRACTION:');
console.log('   Original fbclid:', originalFbclid);
console.log('   Length:', originalFbclid?.length);
console.log('   Has mixed case:', /[A-Z]/.test(originalFbclid) && /[a-z]/.test(originalFbclid));

// 3. Generate fbc (same as generateFbcFromFbclid)
function generateFbcFromFbclid(fbclid) {
  const timestamp = Math.floor(Date.now() / 1000);
  return `fb.1.${timestamp}.${fbclid}`;
}

const generatedFbc = generateFbcFromFbclid(originalFbclid);

console.log('\n3. FBC GENERATION:');
console.log('   Generated fbc:', generatedFbc);

// 4. Simulate getBrowserData() function
function simulateGetBrowserData() {
  return {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    fbp: 'fb.1.1753800000000.123456789', // Mock fbp
    fbc: generatedFbc, // This would come from getFbcFromUrlOrCookie
    sourceUrl: fbAdUrl
  };
}

const browserData = simulateGetBrowserData();

console.log('\n4. BROWSER DATA:');
console.log('   fbc in browserData:', browserData.fbc);

// 5. Simulate the event data that would be sent to Meta API
const eventData = {
  event_name: 'PageView',
  event_time: Math.floor(Date.now() / 1000),
  action_source: 'website',
  event_id: 'test-event-123',
  event_source_url: fbAdUrl,
  user_data: {
    client_ip_address: '192.168.1.100',
    client_user_agent: browserData.userAgent,
    fbc: browserData.fbc || '',
    fbp: browserData.fbp || '',
  }
};

console.log('\n5. EVENT DATA PREPARED FOR META API:');
console.log('   user_data.fbc:', eventData.user_data.fbc);

// 6. Simulate JSON.stringify (same as what happens in fetch request)
const jsonPayload = JSON.stringify(eventData, null, 2);

console.log('\n6. JSON PAYLOAD:');
console.log(jsonPayload);

// 7. Parse JSON back (to simulate what happens server-side)
const parsedEventData = JSON.parse(jsonPayload);

console.log('\n7. PARSED ON SERVER:');
console.log('   user_data.fbc after JSON round-trip:', parsedEventData.user_data.fbc);

// 8. Check if fbc value has changed through the process
const finalFbc = parsedEventData.user_data.fbc;
const finalFbcParts = finalFbc.split('.');
const finalFbclidPortion = finalFbcParts.slice(3).join('.');

console.log('\n8. FINAL VALIDATION:');
console.log('   Original fbclid:', originalFbclid);
console.log('   Final fbclid in fbc:', finalFbclidPortion);
console.log('   Values match exactly:', originalFbclid === finalFbclidPortion);
console.log('   Case preserved:', originalFbclid === finalFbclidPortion ? 'YES' : 'NO');

// 9. Test for potential issues
console.log('\n9. POTENTIAL ISSUES CHECK:');

// Check for URL encoding/decoding issues
const encodedFbclid = encodeURIComponent(originalFbclid);
const decodedFbclid = decodeURIComponent(originalFbclid);
console.log('   URL encoded fbclid:', encodedFbclid);
console.log('   URL decoded fbclid:', decodedFbclid);
console.log('   URLSearchParams automatically decodes:', originalFbclid === decodedFbclid);

// Check for character encoding issues
console.log('   Contains special chars:', /[^a-zA-Z0-9_-]/.test(originalFbclid));
console.log('   UTF-8 length:', new TextEncoder().encode(originalFbclid).length);

// 10. Simulate exactly what the server route.ts does
console.log('\n10. SERVER-SIDE PROCESSING SIMULATION:');

// The route.ts just passes fbc through without modification:
// if (fbc) userData.fbc = fbc;
const serverUserData = {};
if (parsedEventData.user_data.fbc) {
  serverUserData.fbc = parsedEventData.user_data.fbc;
}

console.log('   Server processed fbc:', serverUserData.fbc);
console.log('   Still matches original:', serverUserData.fbc === finalFbc);

// 11. Final Meta API payload
const metaPayload = {
  data: [
    {
      event_name: parsedEventData.event_name,
      event_time: parsedEventData.event_time,
      action_source: parsedEventData.action_source,
      event_id: parsedEventData.event_id,
      user_data: serverUserData,
      event_source_url: parsedEventData.event_source_url
    }
  ]
};

console.log('\n11. FINAL META API PAYLOAD:');
console.log(JSON.stringify(metaPayload, null, 2));

console.log('\n=== CONCLUSION ===');
console.log('The fbc parameter case is preserved throughout the entire flow.');
console.log('If Meta is complaining about modified fbclid, the issue might be:');
console.log('1. The _fbc cookie being set by Facebook Pixel itself');
console.log('2. Browser cookie handling modifying the value');
console.log('3. Timing issues with fbc generation vs cookie reading');
console.log('4. Multiple fbc values conflicting (URL vs cookie)');
