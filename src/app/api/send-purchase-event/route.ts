import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { checkoutDataStore } from '@/lib/checkoutDataStore';
import { getTestEventCode } from '@/lib/metaHelpers';
import { isPaymentProcessed } from '@/lib/paymentDeduplication';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, paymentReference } = body;

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      );
    }

    if (!paymentReference) {
      return NextResponse.json(
        { success: false, error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    // Check if this payment has been processed to prevent duplicates
    if (!isPaymentProcessed(paymentReference)) {
      return NextResponse.json(
        { success: false, error: 'Payment not found or not verified' },
        { status: 400 }
      );
    }

    // Verify payment with Paystack to get transaction details
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${paymentReference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const verificationData = await verifyResponse.json();

    if (!verifyResponse.ok || verificationData.data.status !== 'success') {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    const transaction = verificationData.data;

    // Try to retrieve the original InitiateCheckout data from in-memory store
    console.log('🔍 Retrieving InitiateCheckout data from memory for eventId:', eventId);
    const checkoutData = checkoutDataStore.get(eventId);
    
    let userData: any = null;
    let sourceUrl = null;
    
    if (checkoutData) {
      console.log('✅ Found original InitiateCheckout data in memory');
      userData = checkoutData.userData;
      sourceUrl = checkoutData.sourceUrl;
    } else {
      console.warn('⚠️ No InitiateCheckout data found in memory, falling back to Paystack customer data');
      
      // Fallback to Paystack customer data
      const customer = transaction.customer || {};
      const customerEmail = customer.email || '';
      const customerPhone = customer.phone || '';
      const customerName = customer.first_name || customer.last_name ? 
        `${customer.first_name || ''} ${customer.last_name || ''}`.trim() : '';

      userData = {} as any;

      if (customerEmail) {
        userData.em = [crypto
          .createHash('sha256')
          .update(customerEmail.toLowerCase().trim())
          .digest('hex')];
      }

      if (customerPhone) {
        const cleanPhone = customerPhone.replace(/\D/g, '');
        const phoneWithCountryCode = cleanPhone.startsWith('234') 
          ? cleanPhone 
          : `234${cleanPhone.replace(/^0/, '')}`;
        userData.ph = [crypto
          .createHash('sha256')
          .update(phoneWithCountryCode)
          .digest('hex')];
      }

      if (customerName) {
        userData.fn = [crypto
          .createHash('sha256')
          .update(customerName.toLowerCase().trim())
          .digest('hex')];
      }

      sourceUrl = `${request.nextUrl.origin}/2025-summer-academy-surulere`;
    }

    // Only proceed if we have user data
    if (!userData || (!userData.em && !userData.ph)) {
      return NextResponse.json(
        { success: false, error: 'No user data available for tracking' },
        { status: 400 }
      );
    }

    const finalSourceUrl = sourceUrl || `${request.nextUrl.origin}/2025-summer-academy-surulere`;

    console.log('📊 User data being sent to Meta Purchase event:', {
      hasEmail: !!(userData?.em?.length),
      hasPhone: !!(userData?.ph?.length), 
      hasName: !!(userData?.fn?.length),
      hasIP: !!(userData?.client_ip_address),
      hasUserAgent: !!(userData?.client_user_agent),
      hasFbp: !!(userData?.fbp),
      hasFbc: !!(userData?.fbc),
      sourceUrl: finalSourceUrl
    });

    // Determine test event code
    let testEventCode: string | undefined = undefined;
    
    // Check source URL for test parameters
    if (finalSourceUrl) {
      const detectedTestCode = getTestEventCode(finalSourceUrl);
      if (detectedTestCode) {
        testEventCode = detectedTestCode;
        console.log('🧪 Using test event code from source URL for Purchase:', testEventCode);
      }
    }
    
    // Check referer header
    if (!testEventCode) {
      const refererUrl = request.headers.get('referer') || '';
      if (refererUrl) {
        const detectedTestCode = getTestEventCode(refererUrl);
        if (detectedTestCode) {
          testEventCode = detectedTestCode;
          console.log('🧪 Using test event code from referer for Purchase:', testEventCode);
        }
      }
    }
    
    // Log Purchase event test mode status
    if (testEventCode) {
      console.log('🧪 PURCHASE EVENT - META TEST MODE ENABLED:', {
        testEventCode,
        reference: transaction.reference,
        amount: transaction.amount / 100
      });
    } else {
      console.log('🏭 PURCHASE EVENT - META PRODUCTION MODE:', {
        reference: transaction.reference,
        amount: transaction.amount / 100
      });
    }

    // Use the SAME event ID from InitiateCheckout for Purchase event (for proper deduplication)
    const purchaseEventId = eventId;
    
    const conversionData = {
      event_name: 'Purchase',
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_id: purchaseEventId,
      event_source_url: finalSourceUrl,
      user_data: userData,
      custom_data: {
        value: transaction.amount / 100, // Convert from kobo to naira
        currency: 'NGN',
      },
      original_event_data: {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000)
      },
      // Include test event code if in test mode
      ...(testEventCode && { test_event_code: testEventCode }),
    };

    // Send to meta-conversion endpoint
    const metaResponse = await fetch(
      `${request.nextUrl.origin}/api/meta-conversion`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversionData),
      }
    );

    const metaResult = await metaResponse.json();
    
    if (!metaResponse.ok) {
      console.error('Meta Purchase conversion failed:', metaResult);
      return NextResponse.json(
        { success: false, error: 'Failed to send Purchase event to Meta', details: metaResult },
        { status: 500 }
      );
    }

    console.log('✅ Purchase event sent to Meta successfully:', metaResult);
    
    // Log to SheetDB for comprehensive tracking
    try {
      await fetch(`${request.nextUrl.origin}/api/log-meta-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'Purchase',
          event_id: conversionData.event_id,
          event_time: conversionData.event_time,
          // Include test event code in logging if present
          ...(testEventCode && { test_event_code: testEventCode }),
          user_data: userData,
          custom_data: conversionData.custom_data,
          event_source_url: finalSourceUrl,
          meta_response: metaResult,
          additional_data: {
            transaction_data: {
              reference: transaction.reference,
              amount: transaction.amount / 100,
              status: transaction.status,
              paid_at: transaction.paid_at,
              customer: transaction.customer,
            },
            test_mode: !!testEventCode,
            triggered_from: 'success_page'
          }
        }),
      });
    } catch (sheetError) {
      console.warn('⚠️ Purchase SheetDB logging failed:', sheetError);
    }

    // Clean up the checkout data after successful Purchase event
    checkoutDataStore.remove(eventId);
    console.log('🗑️ Cleaned up checkout data from memory store');

    return NextResponse.json({
      success: true,
      message: 'Purchase event sent to Meta successfully',
      event_id: purchaseEventId,
      meta_response: metaResult,
    });

  } catch (error) {
    console.error('Error sending Purchase event:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
