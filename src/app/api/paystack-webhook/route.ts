import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface PaystackWebhookData {
  event: string;
  data: {
    id: number;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    customer: {
      email: string;
      first_name?: string;
      last_name?: string;
      phone?: string;
    };
    created_at: string;
    paid_at?: string;
    channel: string;
    ip_address?: string;
    metadata?: any;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');
    
    if (!signature) {
      console.error('Missing Paystack signature');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET || '')
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      console.error('Invalid Paystack signature');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const webhookData: PaystackWebhookData = JSON.parse(body);
    
    // Only process successful charge events
    if (webhookData.event !== 'charge.success') {
      console.log('Ignoring non-success event:', webhookData.event);
      return NextResponse.json({ message: 'Event ignored' });
    }

    const { data: paymentData } = webhookData;
    const customerEmail = paymentData.customer.email;

    console.log('Processing successful payment:', {
      reference: paymentData.reference,
      email: customerEmail,
      amount: paymentData.amount / 100, // Convert from kobo
      customer: paymentData.customer, // Log full customer object for debugging
      paymentDataKeys: Object.keys(paymentData), // Log all available keys
    });

    // Retrieve stored lead data
    const leadResponse = await fetch(
      `${request.nextUrl.origin}/api/store-lead?email=${encodeURIComponent(customerEmail)}`,
      { method: 'GET' }
    );

    if (!leadResponse.ok) {
      console.error('Lead data not found for email:', customerEmail);
      return NextResponse.json({ 
        error: 'Lead data not found',
        email: customerEmail 
      }, { status: 404 });
    }

    const { data: leadData } = await leadResponse.json();

    console.log('Found matching lead data:', {
      eventId: leadData.eventId,
      email: leadData.email,
      name: leadData.name,
      phone: leadData.phone,
      fullLeadData: leadData, // Log full lead data for debugging
    });

    // Create Meta user data using stored lead information
    const metaUserData: any = {};
    
    if (leadData.email) {
      metaUserData.em = crypto
        .createHash('sha256')
        .update(leadData.email.toLowerCase().trim())
        .digest('hex');
    }

    if (leadData.phone) {
      const cleanPhone = leadData.phone.replace(/\D/g, '');
      const phoneWithCountryCode = cleanPhone.startsWith('234') 
        ? cleanPhone 
        : `234${cleanPhone.replace(/^0/, '')}`;
      
      metaUserData.ph = crypto
        .createHash('sha256')
        .update(phoneWithCountryCode)
        .digest('hex');
    }

    if (leadData.clientIp) metaUserData.client_ip_address = leadData.clientIp;
    if (leadData.userAgent) metaUserData.client_user_agent = leadData.userAgent;
    if (leadData.fbp) metaUserData.fbp = leadData.fbp;
    if (leadData.fbc) metaUserData.fbc = leadData.fbc;

    // Create Meta Purchase event
    const metaEventData = {
      event_name: 'Purchase',
      event_time: Math.floor(new Date(paymentData.paid_at || paymentData.created_at).getTime() / 1000),
      action_source: 'website',
      event_id: leadData.eventId, // Critical: Same event_id for deduplication
      event_source_url: leadData.sourceUrl || 'https://academy.wandgroup.com/2025-summer-academy-surulere',
      user_data: metaUserData,
      attribution_data: {
        ad_id: null,
        adset_id: null,
        campaign_id: null
      },
      custom_data: {
        currency: 'NGN',
        num_items: 50000,
      },
      original_event_data: {
        event_name: 'Purchase',
        event_time: Math.floor(new Date(paymentData.paid_at || paymentData.created_at).getTime() / 1000)
      }
    };

    // Send Purchase event to Meta Conversions API
    const metaResponse = await fetch(
      `${request.nextUrl.origin}/api/meta-conversion`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metaEventData),
      }
    );

    if (!metaResponse.ok) {
      const metaError = await metaResponse.json();
      console.error('Failed to send Meta conversion:', metaError);
      // Don't fail the webhook, but log the error
    } else {
      const metaResult = await metaResponse.json();
      console.log('Meta Purchase event sent successfully:', {
        eventId: leadData.eventId,
        eventsReceived: metaResult.events_received,
      });
    }

    // Update lead status to PAID in Google Sheets
    await updateLeadStatus(leadData.eventId, 'PAID', paymentData.reference);

    // Store successful payment data
    await storePaymentData({
      reference: paymentData.reference,
      eventId: leadData.eventId,
      email: customerEmail,
      amount: paymentData.amount / 100,
      currency: paymentData.currency,
      status: paymentData.status,
      paidAt: paymentData.paid_at || paymentData.created_at,
      // Priority: Paystack customer data > Lead data > fallback
      customerName: (paymentData.customer.first_name && paymentData.customer.last_name) 
        ? `${paymentData.customer.first_name} ${paymentData.customer.last_name}`.trim()
        : leadData.name || leadData.customerName || 'Unknown Customer',
      customerPhone: paymentData.customer.phone || leadData.phone || leadData.customerPhone || 'Not provided',
    });

    console.log('Webhook processed successfully:', {
      reference: paymentData.reference,
      eventId: leadData.eventId,
      metaEventSent: metaResponse.ok,
    });

    return NextResponse.json({ 
      message: 'Webhook processed successfully',
      reference: paymentData.reference,
      eventId: leadData.eventId,
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Helper function to update lead status in SheetDB
async function updateLeadStatus(eventId: string, status: string, paymentReference?: string) {
  try {
    const sheetdbApiUrl = process.env.SHEETDB_API_URL;
    const sheetdbApiKey = process.env.SHEETDB_API_KEY;

    if (!sheetdbApiUrl) {
      console.log('SheetDB not configured - skipping lead status update');
      return;
    }

    // Build update URL for SheetDB
    const updateUrl = `${sheetdbApiUrl}/eventId/${encodeURIComponent(eventId)}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (sheetdbApiKey) {
      headers['Authorization'] = `Bearer ${sheetdbApiKey}`;
    }

    const updateData: any = { status };
    if (paymentReference) {
      updateData.paymentRef = paymentReference;
    }

    const response = await fetch(updateUrl, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SheetDB update error:', {
        status: response.status,
        error: errorText
      });
      throw new Error(`SheetDB update failed: ${response.status}`);
    }

    console.log(`Updated lead status to ${status} for eventId: ${eventId}`);

  } catch (error) {
    console.error('Error updating lead status:', error);
  }
}

// Helper function to store payment data in SheetDB
async function storePaymentData(paymentData: any) {
  try {
    const sheetdbApiUrl = process.env.SHEETDB_API_URL;
    const sheetdbApiKey = process.env.SHEETDB_API_KEY;

    if (!sheetdbApiUrl) {
      console.log('SheetDB not configured - payment data logged to console:');
      console.log('Payment Data:', {
        timestamp: new Date().toISOString(),
        reference: paymentData.reference,
        eventId: paymentData.eventId,
        email: paymentData.email,
        customerName: paymentData.customerName,
        customerPhone: paymentData.customerPhone,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: paymentData.status,
      });
      return;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (sheetdbApiKey) {
      headers['Authorization'] = `Bearer ${sheetdbApiKey}`;
    }

    // Create a separate sheet/tab for payments by appending /payments to the URL
    const paymentSheetUrl = sheetdbApiUrl.includes('/payments') 
      ? sheetdbApiUrl 
      : `${sheetdbApiUrl}/payments`;

    const paymentRecord = {
      timestamp: new Date().toISOString(),
      reference: paymentData.reference,
      eventId: paymentData.eventId,
      email: paymentData.email,
      customerName: paymentData.customerName,
      customerPhone: paymentData.customerPhone,
      amount: paymentData.amount,
      currency: paymentData.currency,
      status: paymentData.status,
    };

    console.log('Storing payment record:', paymentRecord); // Debug log

    const response = await fetch(paymentSheetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(paymentRecord),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SheetDB payment storage error:', {
        status: response.status,
        error: errorText
      });
      // Don't throw - just log the error
      return;
    }

    console.log('Payment data stored successfully in SheetDB');

  } catch (error) {
    console.error('Error storing payment data:', error);
  }
}

// GET method for webhook verification (required by some webhook services)
export async function GET() {
  return NextResponse.json({ 
    message: 'Paystack webhook endpoint',
    status: 'active' 
  });
} 