import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference, eventId } = body;

    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Payment reference is required' },
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

      // Fire Meta Conversions API Purchase event
      const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
      const accessToken = process.env.META_CONVERSIONS_API_TOKEN;
      
      if (pixelId && accessToken) {
        try {
          // Search for the InitiateCheckout event in SheetDB to get original user data
          let originalUserData = null;
          
          try {
            const searchResponse = await fetch(`${process.env.SHEETDB_API_URL}/search?event_id=${eventId}&event_name=InitiateCheckout`);
            
            if (searchResponse.ok) {
              const searchResults = await searchResponse.json();
              
              if (searchResults && searchResults.length > 0) {
                const initiateCheckoutEvent = searchResults[0];
                originalUserData = {
                  email_hash: initiateCheckoutEvent.email_hash,
                  phone_hash: initiateCheckoutEvent.phone_hash,
                  name_hash: initiateCheckoutEvent.name_hash,
                  client_ip_address: initiateCheckoutEvent.ip_address,
                  client_user_agent: initiateCheckoutEvent.user_agent,
                  fbp: initiateCheckoutEvent.facebook_browser_id,
                  fbc: initiateCheckoutEvent.facebook_click_id,
                };
                console.log('✅ Found original InitiateCheckout user data for Purchase event');
              } else {
                console.warn('⚠️ No InitiateCheckout event found for eventId:', eventId);
              }
            } else {
              console.warn('⚠️ Failed to search for InitiateCheckout event in SheetDB');
            }
          } catch (searchError) {
            console.error('Error searching for original user data:', searchError);
          }

          // Use original user data if available, otherwise fall back to Paystack data
          let hashedEmail, hashedPhone, hashedName, clientIp, userAgent, fbp, fbc;
          
          if (originalUserData) {
            // Use the original hashed data from InitiateCheckout
            hashedEmail = originalUserData.email_hash;
            hashedPhone = originalUserData.phone_hash;
            hashedName = originalUserData.name_hash;
            clientIp = originalUserData.client_ip_address;
            userAgent = originalUserData.client_user_agent;
            fbp = originalUserData.fbp;
            fbc = originalUserData.fbc;
          } else {
            // Fallback: Generate hashes from Paystack customer data
            const customer = transaction.customer || {};
            const customerEmail = customer.email || '';
            const customerPhone = customer.phone || '';
            const customerName = customer.first_name || customer.last_name ? 
              `${customer.first_name || ''} ${customer.last_name || ''}`.trim() : '';

            if (customerEmail) {
              hashedEmail = crypto
                .createHash('sha256')
                .update(customerEmail.toLowerCase().trim())
                .digest('hex');
            }

            if (customerPhone) {
              const cleanPhone = customerPhone.replace(/\D/g, '');
              const phoneWithCountryCode = cleanPhone.startsWith('234') 
                ? cleanPhone 
                : `234${cleanPhone.replace(/^0/, '')}`;
              hashedPhone = crypto
                .createHash('sha256')
                .update(phoneWithCountryCode)
                .digest('hex');
            }

            if (customerName) {
              hashedName = crypto
                .createHash('sha256')
                .update(customerName.toLowerCase().trim())
                .digest('hex');
            }
          }

          // Only proceed if we have at least email hash
          if (hashedEmail) {

            const conversionData = {
              event_name: 'Purchase',
              event_time: Math.floor(Date.now() / 1000),
              action_source: 'website',
              event_id: eventId, // Same event_id for deduplication with frontend pixel
              event_source_url: 'https://academy.wandgroup.com/2025-summer-academy-surulere',
              user_data: {
                em: [hashedEmail],
                ...(hashedPhone && { ph: [hashedPhone] }),
                ...(hashedName && { fn: [hashedName] }),
                ...(clientIp && { client_ip_address: clientIp }),
                ...(userAgent && { client_user_agent: userAgent }),
                ...(fbp && { fbp: fbp }),
                ...(fbc && { fbc: fbc }),
              },
              attribution_data: {
                ad_id: null,
                adset_id: null,
                campaign_id: null
              },
              custom_data: {
                value: transaction.amount / 100, // Convert from kobo to naira
                currency: 'NGN',
              },
              original_event_data: {
                event_name: 'Purchase',
                event_time: Math.floor(Date.now() / 1000)
              }
            };

            // Send to our meta-conversion endpoint (credentials handled server-side)
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
                    event_id: eventId,
                    event_time: Math.floor(Date.now() / 1000),
                    test_event_code: 'TEST92428', 
                    user_data: {
                      em: [hashedEmail],
                      ...(hashedPhone && { ph: [hashedPhone] }),
                      ...(hashedName && { fn: [hashedName] }),
                      ...(clientIp && { client_ip_address: clientIp }),
                      ...(userAgent && { client_user_agent: userAgent }),
                      ...(fbp && { fbp: fbp }),
                      ...(fbc && { fbc: fbc }),
                    },
                    custom_data: {
                      "currency": "NGN",
                      "value": 50000
                    },
                    event_source_url: 'https://academy.wandgroup.com/2025-summer-academy-surulere',
                    source_info: {
                      page_path: '/2025-summer-academy-surulere',
                      referrer: '',
                      utm_source: '',
                      utm_medium: '',
                      utm_campaign: '',
                    },
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
            console.warn('⚠️ No customer email available from Paystack transaction for Meta tracking');
          }
        } catch (error) {
          console.error('Error sending Meta Purchase conversion:', error);
        }
      } else {
        console.warn('⚠️ Meta Pixel ID or Access Token missing for Purchase event tracking');
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