# Purchase Event Duplicate Fix - Root Cause Analysis & Solution

## 🚨 Root Cause Identified

The problem was **two different event IDs** being generated in the payment flow:

### The Issue:
1. **EnhancedEnrollmentForm** generates `currentEventId` for the form submission
2. **PaystackButton** was generating a NEW `initiateCheckoutEventId` for InitiateCheckout event
3. This created a mismatch where:
   - InitiateCheckout used `initiateCheckoutEventId` 
   - Purchase event tried to use different event IDs
   - Success page used `currentEventId` from form
   - Result: Multiple events with different IDs = DUPLICATION

### The Flow Before Fix:
```
Form: generateEventId() → currentEventId (e.g., "abc-123")
  ↓
PaystackButton: generateEventId() → initiateCheckoutEventId (e.g., "def-456") ❌ DIFFERENT!
  ↓
Payment Success: Uses currentEventId ("abc-123") 
  ↓
Verify Payment: Uses eventId from request
  ↓
Result: Confusion and potential duplicate events
```

## ✅ Solution Implemented

### 1. Event ID Consistency
**Fixed PaystackButton to reuse the form's event ID:**

```typescript
// BEFORE (WRONG):
const initiateCheckoutEventId = generateEventId(); // New ID!

// AFTER (CORRECT):
const initiateCheckoutEventId = leadData.eventId; // Reuse form's event ID!
```

### 2. Complete Event Flow (Fixed):
```
Form: generateEventId() → currentEventId ("abc-123")
  ↓
LeadData: { eventId: "abc-123", ... }
  ↓
PaystackButton: Uses leadData.eventId ("abc-123") ✅ SAME!
  ↓
InitiateCheckout Event: eventId = "abc-123"
  ↓
Payment Success: eventId = "abc-123" 
  ↓
Verify Payment: eventId = "abc-123"
  ↓
Purchase Event: eventId = "abc-123" ✅ SAME!
  ↓
Success Page: eventId = "abc-123"
  ↓
Purchase Pixel Event: eventId = "abc-123" ✅ SAME!
```

### 3. Added Comprehensive Logging
Added tracing logs at each step to verify event ID consistency:
- Form submission event ID
- PaystackButton event ID usage  
- Payment verification event ID
- Success page event ID

## 🔍 Files Modified

1. **PaystackButton.tsx** - Use `leadData.eventId` instead of generating new ID
2. **EnhancedEnrollmentForm.tsx** - Added event ID tracing logs
3. **verify-payment/route.ts** - Added event ID tracing logs  
4. **success/page.tsx** - Added event ID tracing logs

## 🎯 Expected Results

- ✅ **One consistent event ID** throughout the entire payment flow
- ✅ **No duplicate Purchase events** in Meta Events Manager
- ✅ **Proper deduplication** between Pixel and Conversions API
- ✅ **Clear logging** to trace event ID consistency
- ✅ **InitiateCheckout and Purchase events** use the same event ID

## 🧪 Testing Instructions

1. Open browser dev tools → Console tab
2. Complete a test enrollment 
3. Look for these log messages:
   - `🎯 Using form eventId for InitiateCheckout: { eventId: "...", source: "reused from form leadData" }`
   - `🎯 EVENT ID TRACING - Form to Payment Verification: { allMatch: true }`
   - `🎯 EVENT ID TRACING - Verify Payment: { eventIdsMatch: true }`
   - `🎯 EVENT ID TRACING - Success Page: { eventIdFromUrl: "same-id" }`
4. Verify in Meta Events Manager that only ONE Purchase event appears
5. Confirm Purchase and InitiateCheckout events have the same event ID

## 🚫 Webhook Note
Since webhook is not in use, all webhook-related deduplication code is not active but remains for future use if needed.
