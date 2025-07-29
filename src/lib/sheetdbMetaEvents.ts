interface MetaEventData {
  event_name: 'ViewContent' | 'Contact' | 'InitiateCheckout' | 'Purchase';
  event_id: string;
  event_time: number;
  user_data?: {
    em?: string[];
    ph?: string[];
    fn?: string[];
    external_id?: string[];
    // Add original data fields
    email?: string;
    phone?: string;
    name?: string;
    client_ip_address?: string;
    client_user_agent?: string;
    fbp?: string;
    fbc?: string;
  };
  custom_data?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    num_items?: number;
  };
  event_source_url?: string;
  source_info?: {
    page_path?: string;
    referrer?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
  meta_response?: {
    events_received?: number;
    fbtrace_id?: string;
  };
}

export async function logMetaEventToSheetDB(eventData: MetaEventData, additionalData?: any) {
  try {
    const sheetdbApiUrl = process.env.SHEETDB_API_URL;

    if (!sheetdbApiUrl) {
      console.error('SHEETDB_API_URL environment variable is missing for Meta events tracking.');
      throw new Error('Server configuration error: Missing SHEETDB environment variables', {
        cause: 'MISSING_ENV_VARIABLES',
      });
    }

    // Get the current timestamp
    const timestamp = new Date().toISOString();
    const readableTime = new Date().toLocaleString('en-NG', { 
      timeZone: 'Africa/Lagos',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Extract user data safely
    const userData = eventData.user_data || {};
    const customData = eventData.custom_data || {};
    const sourceInfo = eventData.source_info || {};
    const metaResponse = eventData.meta_response || {};

    // Prepare data for SheetDB (column names should match your sheet headers)
    const sheetData = {
      timestamp,                                    // Timestamp (ISO)
      readable_time: readableTime,                 // Readable Time (Lagos timezone)
      event_name: eventData.event_name,            // Event Name
      event_id: eventData.event_id,                // Event ID
      event_time: eventData.event_time,            // Event Time (Unix timestamp)
      email: userData.email || '',                 // Original Email
      phone: userData.phone || '',                 // Original Phone
      name: userData.name || '',                   // Original Name
      email_hash: userData.em?.[0] || '',          // Email Hash (first one from array)
      phone_hash: userData.ph?.[0] || '',          // Phone Hash (first one from array)
      name_hash: userData.fn?.[0] || '',           // Name Hash (first one from array)
      ip_address: userData.client_ip_address || '', // IP Address
      user_agent: userData.client_user_agent || '', // User Agent
      facebook_browser_id: userData.fbp || '',     // Facebook Browser ID
      facebook_click_id: userData.fbc || '',       // Facebook Click ID
      external_id: userData.external_id?.[0] || '', // External ID (hashed email for tracking)
      event_value: customData.value || '',         // Event Value
      currency: customData.currency || '',         // Currency
      content_name: customData.content_name || '', // Content Name
      content_category: customData.content_category || '', // Content Category
      page_url: eventData.event_source_url || '',  // Page URL
      referrer: sourceInfo.referrer || '',         // Referrer
      utm_source: sourceInfo.utm_source || '',     // UTM Source
      utm_medium: sourceInfo.utm_medium || '',     // UTM Medium
      utm_campaign: sourceInfo.utm_campaign || '', // UTM Campaign
      meta_events_received: metaResponse.events_received || '', // Meta Events Received
      meta_trace_id: metaResponse.fbtrace_id || '', // Meta Trace ID
      additional_data: additionalData ? JSON.stringify(additionalData) : '', // Additional Data (JSON)
    };

    // Prepare headers for SheetDB request
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Send to SheetDB
    const response = await fetch(sheetdbApiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        data: [sheetData]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SheetDB Meta events error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`SheetDB request failed: ${response.status}`);
    }

    const responseData = await response.json();
    console.log(`✅ Meta ${eventData.event_name} event logged to SheetDB:`, {
      event_id: eventData.event_id,
      sheetdb_response: responseData
    });

    return { success: true, message: `${eventData.event_name} event logged successfully`, data: responseData };

  } catch (e: unknown) {
    const error = e as { 
      message: string
      cause?: string
    }

    console.error('❌ Error logging Meta event to SheetDB:', error.message);
    
    if (process.env.NODE_ENV === 'development') { 
      if (error?.cause === 'MISSING_ENV_VARIABLES') {
        throw new Error('Server configuration error: Missing SHEETDB environment variables for Meta events tracking.')   
      }
    }
      
    // Don't throw error in production - just log it
    console.error('Meta event SheetDB logging failed, but continuing...');
    return { success: false, message: 'Event tracking failed but operation continued' };
  }
}

// Helper function to parse UTM parameters from URL
export function parseUtmParameters(url: string) {
  try {
    const urlObj = new URL(url);
    return {
      utm_source: urlObj.searchParams.get('utm_source') || '',
      utm_medium: urlObj.searchParams.get('utm_medium') || '',
      utm_campaign: urlObj.searchParams.get('utm_campaign') || '',
      utm_term: urlObj.searchParams.get('utm_term') || '',
      utm_content: urlObj.searchParams.get('utm_content') || '',
    };
  } catch {
    return {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
    };
  }
} 