// Test script to verify fbc generation from fbclid
console.log('=== TESTING FBC GENERATION FROM FBCLID ===\n');

// Test URL with fbclid
const testUrl = 'http://localhost:3000/2025-summer-academy-surulere?campaign_id=120232171987590215&adset_id=125632465853060215&ad_id=124532465897720215&fbclid=PAQ0xDSwL2M_VleHRbW2FlbQEwAGFkaWQBqybKchtwNwGnXSFe8UQ6sS9LMggRD1clC2jpT_WvE76saqEK_cFW5e7fL47VLypfzLmxBQY_aem_5pNIedqVdD3KWCkAO5-r6w#enrollment';

const url = new URL(testUrl);
const urlParams = new URLSearchParams(url.search);
const fbclid = urlParams.get('fbclid');

console.log('1. ORIGINAL FBCLID FROM URL:');
console.log('   fbclid:', fbclid);
console.log('   length:', fbclid?.length);
console.log('   contains uppercase:', fbclid?.includes('A') || fbclid?.includes('B') || fbclid?.includes('C'));
console.log('   contains lowercase:', fbclid?.includes('a') || fbclid?.includes('b') || fbclid?.includes('c'));
console.log('');

// Simulate generateFbcFromFbclid function
function generateFbcFromFbclid(fbclid) {
  const timestamp = Math.floor(Date.now() / 1000);
  return `fb.1.${timestamp}.${fbclid}`;
}

const generatedFbc = generateFbcFromFbclid(fbclid);
console.log('2. GENERATED FBC VALUE:');
console.log('   fbc:', generatedFbc);
console.log('   fbclid portion preserved:', generatedFbc.includes(fbclid));
console.log('');

// Check if the fbclid in the generated fbc is exactly the same
const fbcParts = generatedFbc.split('.');
const fbclidPortion = fbcParts.slice(3).join('.'); // Everything after fb.1.timestamp.
console.log('3. FBC ANALYSIS:');
console.log('   format parts:', fbcParts.slice(0, 3)); // Should be ['fb', '1', timestamp]
console.log('   extracted fbclid from fbc:', fbclidPortion);
console.log('   original fbclid matches:', fbclidPortion === fbclid);
console.log('   case sensitive comparison:', fbclidPortion === fbclid ? 'PASS' : 'FAIL');

// Test for any potential case modifications
console.log('');
console.log('4. CASE PRESERVATION TEST:');
console.log('   Original has mixed case:', /[A-Z]/.test(fbclid) && /[a-z]/.test(fbclid));
console.log('   Generated fbc has mixed case:', /[A-Z]/.test(fbclidPortion) && /[a-z]/.test(fbclidPortion));
console.log('   Character-by-character comparison:');

if (fbclid && fbclidPortion) {
  for (let i = 0; i < Math.max(fbclid.length, fbclidPortion.length); i++) {
    const original = fbclid[i] || 'undefined';
    const generated = fbclidPortion[i] || 'undefined';
    if (original !== generated) {
      console.log(`   MISMATCH at position ${i}: "${original}" vs "${generated}"`);
    }
  }
  console.log('   All characters match:', fbclid === fbclidPortion);
}
