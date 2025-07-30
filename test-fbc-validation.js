// Test the fbc validation in the updated Meta conversion route
console.log('=== TESTING FBC VALIDATION ===\n');

// Test case 1: Valid mixed-case fbclid
const validFbclid = 'PAQ0xDSwL2M_VleHRuA2FlbQEwAGFkaWQBqybKchtwNwGnXSFe8UQ6sS9LMggRD1clC2jpT_WvE76saqEK_cFW5e7fL47VLypfzLmxBQY_aem_5pNIedqVdD3KWCkAO5-r6w';
const validFbc = `fb.1.1753884425.${validFbclid}`;

console.log('1. VALID FBC TEST:');
console.log('   fbc:', validFbc);

// Simulate the validation logic from route.ts
function validateFbc(fbc) {
  console.log('🔍 Validating fbc parameter:', fbc);
  
  const fbcParts = fbc.split('.');
  if (fbcParts.length >= 4 && fbcParts[0] === 'fb' && fbcParts[1] === '1') {
    const fbclidPortion = fbcParts.slice(3).join('.');
    
    console.log('📋 Extracted fbclid from fbc:', fbclidPortion);
    
    const hasUpperCase = /[A-Z]/.test(fbclidPortion);
    const hasLowerCase = /[a-z]/.test(fbclidPortion);
    const hasMixedCase = hasUpperCase && hasLowerCase;
    
    console.log('🔤 FBC Case Analysis:', {
      hasUpperCase,
      hasLowerCase,
      hasMixedCase,
      length: fbclidPortion.length
    });
    
    if (hasLowerCase && !hasUpperCase && fbclidPortion.length > 50) {
      console.warn('⚠️ WARNING: fbclid appears to be all lowercase - possible case modification detected!');
      return false;
    }
    
    return true;
  } else {
    console.warn('⚠️ WARNING: fbc parameter format is invalid:', fbc);
    return false;
  }
}

// Test valid fbc
const isValid = validateFbc(validFbc);
console.log('   Validation result:', isValid ? 'PASS' : 'FAIL');

console.log('\n2. INVALID FBC TEST (all lowercase):');
// Test case 2: Invalid lowercase fbclid
const invalidFbclid = validFbclid.toLowerCase();
const invalidFbc = `fb.1.1753884425.${invalidFbclid}`;
console.log('   fbc:', invalidFbc);

const isInvalid = validateFbc(invalidFbc);
console.log('   Validation result:', isInvalid ? 'PASS' : 'FAIL (as expected)');

console.log('\n3. MALFORMED FBC TEST:');
// Test case 3: Malformed fbc
const malformedFbc = 'invalid-fbc-format';
console.log('   fbc:', malformedFbc);

const isMalformed = validateFbc(malformedFbc);
console.log('   Validation result:', isMalformed ? 'PASS' : 'FAIL (as expected)');

console.log('\n=== SUMMARY ===');
console.log('✅ Added server-side fbc validation to detect case modification');
console.log('✅ Added client-side logging to trace fbc generation');
console.log('✅ Fixed email.to() typo in createMetaUserData function');
console.log('📝 The validation will now log warnings when lowercase fbclid is detected');
console.log('📝 This should help identify where the case modification is happening');
