# Purchase Event Duplication Fix Summary

## Issue Fixed
The Purchase events were sending 2 different event IDs because both the frontend payment verification (`/api/verify-payment`) and the Paystack webhook (`/api/paystack-webhook`) were generating separate Purchase events with unique IDs for the same transaction.

## Root Cause
1. **Frontend verification**: Generated new `purchaseEventId = generateEventId()`
2. **Paystack webhook**: Generated another new `purchaseEventId = generateEventId()`
3. Both endpoints fired Purchase events with different IDs, causing duplicates

## Solution Implemented

### 1. Event ID Consistency
- **Before**: Both endpoints generated new unique event IDs
- **After**: Both endpoints now reuse the original InitiateCheckout event ID for Purchase events
- **Result**: Proper deduplication between Pixel and Conversions API

### 2. Payment Deduplication System
Created `src/lib/paymentDeduplication.ts` with:
- `isPaymentProcessed(reference)`: Check if payment already processed
- `markPaymentAsProcessed(reference)`: Mark payment as processed
- In-memory store to track processed payments by reference

### 3. Cross-Endpoint Protection
- If webhook processes payment first → verification endpoint skips Purchase event
- If verification processes payment first → webhook skips Purchase event
- Both endpoints log when skipping duplicates

### 4. Environment Variables
- Added missing `PAYSTACK_WEBHOOK_SECRET` to `.env.local`

## Files Modified
1. `src/app/api/verify-payment/route.ts` - Use original event ID, add deduplication
2. `src/app/api/paystack-webhook/route.ts` - Use original event ID, add deduplication  
3. `src/lib/paymentDeduplication.ts` - New shared deduplication utility
4. `.env.local` - Added missing webhook secret

## Expected Behavior After Fix
- ✅ Only **one Purchase event** per successful payment
- ✅ Purchase event uses **same event ID** as InitiateCheckout
- ✅ Proper deduplication between Pixel and Conversions API
- ✅ Race condition protection between webhook and frontend verification
- ✅ Clear logging for debugging

## Testing Recommendations
1. Complete a test payment and verify only one Purchase event appears in Meta Events Manager
2. Check server logs to confirm deduplication messages
3. Verify the Purchase event ID matches the InitiateCheckout event ID
4. Test with webhook firing before/after frontend verification
