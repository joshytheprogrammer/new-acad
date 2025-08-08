import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation - just check for required fields
    if (!body.email || !body.name || !body.phone || !body.eventId) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, phone, eventId' },
        { status: 400 }
      );
    }

    const {  
      email,
      name,
      phone,
      eventId,
      fbp,
      fbc,
      userAgent,
      clientIp,
      sourceUrl,
      timestamp,
    } = body;

    // SheetDB.io setup
    const sheetdbApiUrl = process.env.SHEETDB_API_URL;

    if (!sheetdbApiUrl) {
      return NextResponse.json(
        { error: 'SheetDB not configured' },
        { status: 500 }
      );
    }

    // Prepare data for SheetDB - include price and currency at initiation
    const leadData = {
      timestamp,
      eventId,
      email,
      name,
      phone,
      fbp: fbp || '',
      fbc: fbc || '',
      userAgent,
      clientIp,
      sourceUrl,
      amount: 10000, // Store the amount when lead is created
      currency: 'NGN', // Store the currency when lead is created
      status: 'PENDING',
      reference: '', // Will be filled when payment is successful
      customerName: name, // Store the customer name immediately
      customerPhone: phone, // Store the customer phone immediately
      customerEmail: email, // Store the customer email immediately
      paymentChannel: '', // Will be filled when payment is successful
      transactionId: '', // Will be filled when payment is successful
      paidAt: '', // Will be filled when payment is successful
      updatedAt: timestamp // Track when record was last updated
    };

    // Send to SheetDB
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const sheetResponse = await fetch(sheetdbApiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(leadData),
    });

    if (!sheetResponse.ok) {
      const errorText = await sheetResponse.text();
      console.error('SheetDB API error:', {
        status: sheetResponse.status,
        statusText: sheetResponse.statusText,
        error: errorText
      });
      
      throw new Error(`SheetDB API error: ${sheetResponse.status} ${sheetResponse.statusText}`);
    }

    const sheetResult = await sheetResponse.json();

    return NextResponse.json({ 
      success: true, 
      message: 'Lead data stored successfully',
      eventId,
      sheetResult
    });

  } catch (error) {
    console.error('Error storing lead data:', error);

    return NextResponse.json(
      { error: 'Failed to store lead data', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET method to retrieve lead data by eventId (used by webhook)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const email = searchParams.get('email');

    if (!eventId && !email) {
      return NextResponse.json(
        { error: 'eventId or email parameter required' },
        { status: 400 }
      );
    }

    const sheetdbApiUrl = process.env.SHEETDB_API_URL;
    const sheetdbApiKey = process.env.SHEETDB_API_KEY;

    if (!sheetdbApiUrl) {
      return NextResponse.json(
        { error: 'SheetDB not configured' },
        { status: 500 }
      );
    }

    // Build search URL for SheetDB
    let searchUrl = sheetdbApiUrl;
    if (eventId) {
      searchUrl += `/search?eventId=${encodeURIComponent(eventId)}`;
    } else if (email) {
      searchUrl += `/search?email=${encodeURIComponent(email)}`;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (sheetdbApiKey) {
      headers['Authorization'] = `Bearer ${sheetdbApiKey}`;
    }

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SheetDB search error:', {
        status: response.status,
        error: errorText
      });
      
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Lead data not found' },
          { status: 404 }
        );
      }
      
      throw new Error(`SheetDB API error: ${response.status}`);
    }

    const results = await response.json();
    
    // SheetDB returns an array, get the first match
    const leadData = Array.isArray(results) && results.length > 0 ? results[0] : null;

    if (!leadData) {
      return NextResponse.json(
        { error: 'Lead data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: leadData });

  } catch (error) {
    console.error('Error retrieving lead data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve lead data' },
      { status: 500 }
    );
  }
} 