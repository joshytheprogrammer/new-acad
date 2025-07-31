import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Helper function to get client IP address (prioritizes IPv6)
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = request.headers.get('x-client-ip');
  
  let detectedIp = '';
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    detectedIp = forwarded.split(',')[0].trim();
  } else if (realIp) {
    detectedIp = realIp;
  } else if (clientIp) {
    detectedIp = clientIp;
  }
  
  // If we found an IP, check if it's IPv6 or IPv4
  if (detectedIp) {
    console.log('🌐 Detected IP from headers:', detectedIp, detectedIp.includes(':') ? '(IPv6)' : '(IPv4)');
    return detectedIp;
  }
  
  // Fallback to IPv6 loopback, then IPv4 if none found
  console.warn('⚠️ No IP found in headers, using IPv6 loopback fallback');
  return '::1'; // IPv6 loopback instead of IPv4 0.0.0.0
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Use only environment variables - no URL parameter fallbacks
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';
    const accessToken = process.env.META_CONVERSIONS_API_TOKEN || '';

    if (!pixelId || !accessToken) {
      return NextResponse.json(
        { 
          error: 'Meta integration not configured',
          message: 'NEXT_PUBLIC_META_PIXEL_ID and META_CONVERSIONS_API_TOKEN environment variables are required' 
        },
        { status: 500 }
      );
    }

    // Basic validation - just check for required fields
    if (!body.event_name || !body.event_id) {
      return NextResponse.json(
        { error: 'Missing required fields: event_name and event_id' },
        { status: 400 }
      );
    }

    // Get the real client IP from the request
    const clientIp = getClientIP(request);

    // Set event time to current timestamp if not provided
    const eventData = {
      ...body,
      event_time: body.event_time || Math.floor(Date.now() / 1000)
    };

    // Enhance user_data with server-side IP if not provided or if it's a placeholder
    if (eventData.user_data) {
      // Use server-detected IP if client didn't provide one or sent placeholder
      if (!eventData.user_data.client_ip_address || 
          eventData.user_data.client_ip_address === '0.0.0.0' ||
          eventData.user_data.client_ip_address === '::1' ||
          eventData.user_data.client_ip_address === '192.168.1.1') {
        eventData.user_data.client_ip_address = clientIp;
        console.log('🔄 Enhanced client IP with server-detected IP:', clientIp);
      } else {
        console.log('✅ Using client-provided IP:', eventData.user_data.client_ip_address);
      }

      // Validate fbc parameter to ensure fbclid case is preserved
      if (eventData.user_data.fbc) {
        const fbc = eventData.user_data.fbc;
        console.log('🔍 Validating fbc parameter:', fbc);
        
        // Check if fbc follows the correct format: fb.1.{timestamp}.{fbclid}
        const fbcParts = fbc.split('.');
        if (fbcParts.length >= 4 && fbcParts[0] === 'fb' && fbcParts[1] === '1') {
          const fbclidPortion = fbcParts.slice(3).join('.');
          
          // Log the fbclid portion for monitoring
          console.log('📋 Extracted fbclid from fbc:', fbclidPortion);
          
          // Check for potential case modification issues
          const hasUpperCase = /[A-Z]/.test(fbclidPortion);
          const hasLowerCase = /[a-z]/.test(fbclidPortion);
          const hasMixedCase = hasUpperCase && hasLowerCase;
          
          console.log('🔤 FBC Case Analysis:', {
            hasUpperCase,
            hasLowerCase,
            hasMixedCase,
            length: fbclidPortion.length
          });
          
          // Warn if the fbclid appears to be all lowercase (potential case modification)
          if (hasLowerCase && !hasUpperCase && fbclidPortion.length > 50) {
            console.warn('⚠️ WARNING: fbclid appears to be all lowercase - possible case modification detected!');
            console.warn('   This may cause Meta to flag as "modified fbclid value"');
            console.warn('   Original mixed-case fbclid expected from Facebook ads');
          }
        } else {
          console.warn('⚠️ WARNING: fbc parameter format is invalid:', fbc);
        }
      } else {
        console.log('ℹ️ No fbc parameter provided in user_data');
      }
    }

    // Handle attribution data - convert strings to numbers for Meta API
    const attributionData: any = {};
    if (eventData.attribution_data) {
      if (eventData.attribution_data.ad_id) {
        // Try to convert to number, but handle large number precision issues
        const adIdStr = String(eventData.attribution_data.ad_id);
        if (adIdStr.length <= 15) {
          // Safe to convert to number (JavaScript safe integer limit)
          attributionData.ad_id = Number(adIdStr);
        } else {
          // Keep as string for very large numbers to preserve precision
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

    // Prepare the payload for Meta Conversions API
    const payload: any = {
      data: [
        {
          event_name: eventData.event_name,
          event_time: eventData.event_time,
          action_source: "website",
          event_id: eventData.event_id,
          user_data: eventData.user_data,
          custom_data: eventData.custom_data,
          event_source_url: eventData.event_source_url,
          ...(Object.keys(attributionData).length > 0 && { attribution_data: attributionData }),
          original_event_data: eventData.original_event_data,
        }
      ],
      test_event_code: 'TEST62071',
    };

    console.log('📊 Meta conversion received user_data:', {
      hasEmail: !!(eventData.user_data?.em?.length),
      hasPhone: !!(eventData.user_data?.ph?.length),
      hasName: !!(eventData.user_data?.fn?.length), 
      hasIP: !!(eventData.user_data?.client_ip_address),
      hasUserAgent: !!(eventData.user_data?.client_user_agent),
      hasFbp: !!(eventData.user_data?.fbp),
      hasFbc: !!(eventData.user_data?.fbc),
      fullUserData: eventData.user_data
    });

    console.log('Sending Meta conversion event:', payload);

    // Send to Meta Conversions API
    const metaResponse = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const responseData = await metaResponse.json();

    if (!metaResponse.ok) {
      console.error('Meta API error:', responseData);
      return NextResponse.json(
        { 
          error: 'Failed to send event to Meta',
          details: responseData 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Conversion event sent to Meta',
      event_id: eventData.event_id,
      events_received: responseData.events_received,
      meta_response: responseData,
    });

  } catch (error) {
    console.error('Error sending Meta conversion:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Failed to send conversion event',
          message: error.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

// Helper function to create user data with proper hashing
function createMetaUserData(
  email: string,
  phone?: string,
  clientIp?: string,
  userAgent?: string,
  fbp?: string,
  fbc?: string
) {
  const userData: any = {};

  // Hash email
  if (email) {
    userData.em = crypto
      .createHash('sha256')
      .update(email.toLowerCase().trim())
      .digest('hex');
  }

  // Hash phone (ensure Nigerian format)
  if (phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    const phoneWithCountryCode = cleanPhone.startsWith('234') 
      ? cleanPhone 
      : `234${cleanPhone.replace(/^0/, '')}`;
    
    userData.ph = crypto
      .createHash('sha256')
      .update(phoneWithCountryCode)
      .digest('hex');
  }

  // Add other data
  if (clientIp) userData.client_ip_address = clientIp;
  if (userAgent) userData.client_user_agent = userAgent;
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  return userData;
} 