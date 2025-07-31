# Simplified Test Event Code Implementation

This implementation allows you to conditionally enable Meta test mode on your live website using explicit test event code URL parameters only.

## 🎯 Problem Solved

Previously, the test event code was hardcoded as `'TEST62071'` in all Meta API calls, meaning:
- All events went to test mode, affecting production data
- No way to test on live site without impacting analytics
- Manual code changes required to switch between test/production modes

## ✅ Solution

Now you can:
- **Test on live site** by adding explicit test event code parameters
- **Keep production data clean** when testing
- **Use custom test event codes** for different testing scenarios
- **Automatically detect test mode** from test_event_code parameter

## 🚀 How It Works

### URL Parameter Supported

| Parameter | Example | Result |
|-----------|---------|---------|
| `test_event_code=CUSTOM` | `?test_event_code=TEST_V2` | Uses custom test code |

### Detection Priority

The system checks for test mode in this order:

1. **URL Parameters** from `event_source_url` (looks for `test_event_code`)
2. **Request Body** `test_event_code` field
3. **Referer Header** (for payment verification)

## 📋 Usage Examples

### 1. Custom Test Event Code
```
# Use your own test event code
https://academy.wandgroup.com/2025-summer-academy-surulere?test_event_code=SUMMER_2025_TEST
```

### 2. Campaign-Specific Testing
```
# Test specific campaigns
https://academy.wandgroup.com/2025-summer-academy-surulere?test_event_code=CAMPAIGN_A_TEST
```

### 3. Mixed Parameters
```
# Test mode with attribution data
https://academy.wandgroup.com/2025-summer-academy-surulere?test_event_code=CAMPAIGN_TEST&utm_source=facebook&ad_id=123456
```

### 4. Production Mode (Default)
```
# No test_event_code parameter = production mode
https://academy.wandgroup.com/2025-summer-academy-surulere
```

## 🔧 Technical Implementation

### Files Modified

1. **`src/lib/metaHelpers.ts`**
   - Added `getTestEventCode()` function
   - Added `isTestMode()` helper

2. **`src/app/api/meta-conversion/route.ts`**
   - Dynamic test event code detection
   - Enhanced logging for test/production modes

3. **`src/app/api/verify-payment/route.ts`**
   - Test mode detection for Purchase events
   - Updated SheetDB logging with test mode flag

4. **Client-side components updated:**
   - `src/app/2025-summer-academy-surulere/page.tsx`
   - `src/components/academy/summer/EnhancedEnrollmentForm.tsx`
   - `src/components/academy/summer/Contact.tsx`

### Code Example

```typescript
// In your component
import { getTestEventCode } from '@/lib/metaHelpers';

const testEventCode = getTestEventCode();

const eventData = {
  event_name: 'Purchase',
  event_time: Math.floor(Date.now() / 1000),
  // ... other data
  // Only include test_event_code if in test mode
  ...(testEventCode && { test_event_code: testEventCode }),
};
```

## 🎮 Testing Workflow

### Step 1: Enable Test Mode
Visit your live site with explicit test event code:
```
https://academy.wandgroup.com/2025-summer-academy-surulere?test_event_code=MY_TEST_CODE
```

### Step 2: Monitor Console Logs
Look for test mode indicators in browser console:
```
🧪 Test event code detected from URL: MY_TEST_CODE
🧪 META TEST MODE ENABLED: { testEventCode: "MY_TEST_CODE", eventName: "PageView" }
```

### Step 3: Complete User Actions
- Fill out forms
- Make payments
- Navigate pages
- All events will use your custom test event code

### Step 4: Verify in Meta Events Manager
- Events appear in **Test Events** section
- Production events remain unaffected
- Can filter by your specific test event code

### Step 5: Return to Production
Remove test_event_code parameter from URL:
```
https://academy.wandgroup.com/2025-summer-academy-surulere
```

## 📊 Events Affected

All Meta events now support dynamic test mode:

- ✅ **PageView** (landing page)
- ✅ **ViewContent** (enrollment form view)
- ✅ **Contact** (contact form submission)
- ✅ **InitiateCheckout** (payment initiation)
- ✅ **Purchase** (payment completion)

## 🔍 Debugging

### Console Logs to Look For

**Test Mode Enabled:**
```
🧪 Test event code detected from URL: MY_CUSTOM_TEST
🧪 META TEST MODE ENABLED: { testEventCode: "MY_CUSTOM_TEST", eventName: "PageView" }
```

**Production Mode:**
```
🏭 META PRODUCTION MODE: { eventName: "PageView" }
```

### Server-Side Logs

```
🧪 Using test event code from URL: MY_CUSTOM_TEST
📊 Meta payload will include: { test_event_code: "MY_CUSTOM_TEST" }
```

## 🛡️ Safety Features

1. **Backwards Compatible**: Existing functionality unchanged
2. **Default Production**: No test_event_code parameter = production mode
3. **Explicit Only**: Only responds to explicit test_event_code parameter
4. **Comprehensive Logging**: Clear test/production indicators
5. **Custom Test Codes**: Support any custom test event code

## 🚨 Important Notes

- **Only `test_event_code` parameter is supported**
- **Test event code persists through the user journey** (forms, payments)
- **Each event gets its own test mode detection**
- **SheetDB logging includes test mode flag**
- **No impact on production data when testing**

## 🎯 Benefits

1. **Safe Testing**: Test on live site without affecting production data
2. **Explicit Control**: Only activate test mode with explicit parameter
3. **Custom Tracking**: Use specific test event codes for different scenarios
4. **No Accidents**: No generic test mode parameters that could be triggered accidentally
5. **Comprehensive**: Works across all Meta events
6. **Debuggable**: Clear logging and indicators

This simplified implementation gives you precise control over when Meta events are sent in test mode, requiring explicit test_event_code parameters to activate testing.
