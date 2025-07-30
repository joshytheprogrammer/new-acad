import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { checkoutDataStore } from '@/lib/checkoutDataStore';
import { generateEventId } from '@/lib/metaHelpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference, eventId, originalUserData, eventSourceUrl, backupData } = body;

    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required for tracking' },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const verificationData = await verifyResponse.json();

    if (!verifyResponse.ok) {
      console.error('Paystack verification failed:', verificationData);
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    const { data: transaction } = verificationData;

    // Check if payment was successful
    if (transaction.status === 'success') {
      console.log('✅ Payment verified successfully:', {
        reference: transaction.reference,
        amount: transaction.amount / 100,
        customer: transaction.customer
      });

      // Send Purchase event to Meta using the SAME data as InitiateCheckout
      try {
        let userData: any = null;
        let sourceUrl = null;
        
        // Retrieve the original InitiateCheckout data from in-memory store
        if (eventId) {
          console.log('🔍 Retrieving InitiateCheckout data from memory for eventId:', eventId);
          console.log('🔍 Current store stats:', checkoutDataStore.getStats());
          
          const checkoutData = checkoutDataStore.get(eventId);
          
          if (checkoutData) {
            console.log('✅ Found original InitiateCheckout data in memory:', {
              eventId,
              email: checkoutData.leadInfo.email,
              phone: checkoutData.leadInfo.phone,
              name: checkoutData.leadInfo.name,
              hasFbp: !!checkoutData.leadInfo.fbp,
              hasFbc: !!checkoutData.leadInfo.fbc,
              hasUserAgent: !!checkoutData.leadInfo.userAgent,
              hasClientIp: !!checkoutData.leadInfo.clientIp,
              userDataFields: Object.keys(checkoutData.userData)
            });
            
            // Use the exact same userData that was created for InitiateCheckout
            userData = checkoutData.userData;
            sourceUrl = checkoutData.sourceUrl;
            
            console.log('✅ Using EXACT InitiateCheckout user data for Purchase event');
            
            // Optional: Clean up the data after successful use
            // checkoutDataStore.remove(eventId);
          } else {
            console.warn('⚠️ No InitiateCheckout data found in memory for eventId:', eventId);
            
            // Try to use backup data if available
            if (backupData && backupData.userData) {
              console.log('🔄 Using backup data from client sessionStorage');
              userData = backupData.userData;
              sourceUrl = backupData.sourceUrl;
              console.log('✅ Successfully restored data from backup');
            }
          }
        } else {
          console.warn('⚠️ No eventId provided to retrieve InitiateCheckout data');
          console.log('📦 Request body received:', { reference, eventId, hasOriginalUserData: !!originalUserData, hasEventSourceUrl: !!eventSourceUrl });
        }
        
        // Only fallback to Paystack data if we couldn't get the original data
        if (!userData) {
          console.log('⚠️ Could not retrieve InitiateCheckout data from memory, falling back to Paystack customer data');
          
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
        }

        // Only proceed if we have user data
        if (userData && (userData.em || userData.ph)) {
          const finalSourceUrl = sourceUrl || eventSourceUrl || `${request.nextUrl.origin}/2025-summer-academy-surulere`;

          console.log('📊 Final user data being sent to Meta Purchase event:', {
            hasEmail: !!(userData?.em?.length),
            hasPhone: !!(userData?.ph?.length), 
            hasName: !!(userData?.fn?.length),
            hasIP: !!(userData?.client_ip_address),
            hasUserAgent: !!(userData?.client_user_agent),
            hasFbp: !!(userData?.fbp),
            hasFbc: !!(userData?.fbc),
            hasExternalId: !!(userData?.external_id),
            fieldCount: Object.keys(userData).length,
            sourceUrl: finalSourceUrl
          });

          // Generate unique event ID for Purchase event
          const purchaseEventId = generateEventId();
          
          const conversionData = {
            event_name: 'Purchase',
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            event_id: purchaseEventId, // Use unique Purchase event ID
            event_source_url: finalSourceUrl,
            user_data: userData,
            custom_data: {
              value: transaction.amount / 100, // Convert from kobo to naira
              currency: 'NGN',
            },
            original_event_data: {
              event_name: 'Purchase',
              event_time: Math.floor(Date.now() / 1000)
            }
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
          } else {
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
                  test_event_code: 'TEST56480',
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
                    }
                  }
                }),
              });
            } catch (sheetError) {
              console.warn('⚠️ Purchase SheetDB logging failed:', sheetError);
            }
          }
        } else {
          console.warn('⚠️ No customer data available for Meta tracking');
        }
      } catch (error) {
        console.error('Error sending Meta Purchase conversion:', error);
      }

      return NextResponse.json({
        success: true,
        transaction: {
          reference: transaction.reference,
          amount: transaction.amount / 100,
          status: transaction.status,
          paidAt: transaction.paid_at,
          customer: transaction.customer,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Payment was not successful' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 