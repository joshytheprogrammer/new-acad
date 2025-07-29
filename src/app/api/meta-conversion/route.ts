import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Helper function to get client IP address
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = request.headers.get('x-client-ip');
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  if (clientIp) {
    return clientIp;
  }
  
  // Fallback to a default IP if none found
  return '0.0.0.0';
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
          eventData.user_data.client_ip_address === '192.168.1.1') {
        eventData.user_data.client_ip_address = clientIp;
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
          attribution_data: eventData.attribution_data,
          original_event_data: eventData.original_event_data,
        }
      ],
      test_event_code: 'TEST92428',
    };

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