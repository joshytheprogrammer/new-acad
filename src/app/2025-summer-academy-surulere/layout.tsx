"use client";

import { useEffect } from 'react';
import Script from 'next/script';

// Get client IP address
const getClientIp = async (): Promise<string> => {
  try {
    // Try to get IP from a free service
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || '0.0.0.0'; 
  } catch (error) {
    console.warn('Could not get client IP:', error);
    return '0.0.0.0'; // 
  }
};

// Get attribution data from URL parameters
const getAttributionData = () => {
  if (typeof window === 'undefined') {
    return { 
      ad_id: null, 
      adset_id: null, 
      campaign_id: null,
      utm_source: null,
      utm_medium: null,
      utm_term: null,
      utm_content: null,
      utm_campaign: null,
      fbclid: null,
      gclid: null,
    };
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    ad_id: urlParams.get('fbclid') || urlParams.get('gclid') || urlParams.get('ad_id') || null,
    adset_id: urlParams.get('adset_id') || urlParams.get('adgroupid') || null,
    campaign_id: urlParams.get('campaign_id') || urlParams.get('campaignid') || urlParams.get('utm_campaign') || null,
    // Additional attribution data you might want to capture
    utm_source: urlParams.get('utm_source') || null,
    utm_medium: urlParams.get('utm_medium') || null,
    utm_term: urlParams.get('utm_term') || null,
    utm_content: urlParams.get('utm_content') || null,
    utm_campaign: urlParams.get('utm_campaign') || null,
    fbclid: urlParams.get('fbclid') || null,
    gclid: urlParams.get('gclid') || null,
  };
};

// Simple Meta tracking for academy pages
const trackAcademyPageView = async () => {
  // Track with Facebook Pixel if available
  if (typeof window !== 'undefined' && (window as any).fbq) {
    const eventId = `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Get client IP
      const clientIp = await getClientIp();
      
      // Get attribution data from URL parameters
      const attributionData = getAttributionData();
      
      // Fire Facebook Pixel ViewContent event
      (window as any).fbq('track', 'ViewContent', {}, { eventID: eventId });
      
      // Send to Meta Conversions API with proper format
      const eventData = {
        event_name: 'ViewContent',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_id: eventId,
        event_source_url: window.location.href,
        user_data: {
          client_ip_address: clientIp,
          client_user_agent: navigator.userAgent,
          fbc: getCookie('_fbc') || '',
          fbp: getCookie('_fbp') || '',
        },
        attribution_data: {
          ad_id: attributionData.ad_id,
          adset_id: attributionData.adset_id,
          campaign_id: attributionData.campaign_id,
        },
        original_event_data: {
          event_name: 'ViewContent',
          event_time: Math.floor(Date.now() / 1000)
        }
      };


      const response = await fetch('/api/meta-conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Log to SheetDB for comprehensive tracking
        try {
          await fetch('/api/log-meta-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event_name: 'ViewContent',
              event_id: eventId,
              event_time: Math.floor(Date.now() / 1000),
              user_data: {
                client_ip_address: clientIp,
                client_user_agent: navigator.userAgent,
                fbp: getCookie('_fbp') || '',
                fbc: getCookie('_fbc') || '',
              },
              event_source_url: window.location.href,
              source_info: {
                page_path: window.location.pathname,
                referrer: document.referrer || '',
                utm_source: attributionData.utm_source || '',
                utm_medium: attributionData.utm_medium || '',
                utm_campaign: attributionData.utm_campaign || '',
                utm_term: attributionData.utm_term || '',
                utm_content: attributionData.utm_content || '',
                fbclid: attributionData.fbclid || '',
                gclid: attributionData.gclid || '',
              },
              meta_response: result,
            }),
          });
        } catch (sheetError) {
          console.warn('⚠️ ViewContent sheet logging failed:', sheetError);
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to send ViewContent event:', response.status, errorText);
        console.error('📋 Event data that failed:', JSON.stringify(eventData, null, 2));
      }
      
    } catch (error) {
      console.error('❌ Failed to track ViewContent:', error);
    }
  } else {
    console.warn('⚠️ Facebook Pixel not loaded yet');
  }
};

// Helper to get cookies
const getCookie = (name: string): string => {
  if (typeof document === 'undefined') return '';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || '';
  }
  return '';
};

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Small delay to ensure Facebook Pixel is loaded
    const timer = setTimeout(() => {
      trackAcademyPageView();
    }, 2000); // Increased delay to ensure pixel is fully loaded

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Meta Pixel Code - Academy Specific */}
      <Script
        id="meta-pixel-academy"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '775584224867619');
          `,
        }}
      />
      
      {/* Meta Pixel NoScript Fallback */}
      <noscript>
        <img 
          height="1" 
          width="1" 
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=775584224867619&ev=ViewContent&noscript=1"
          alt=""
        />
      </noscript>
      
      {children}
    </>
  );
}
