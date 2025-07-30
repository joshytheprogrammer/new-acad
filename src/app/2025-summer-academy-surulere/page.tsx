"use client";

import { useEffect } from 'react';
import Footer from "@/components/Footer";
import Hero from "@/components/academy/summer/Hero";
import Problem from "@/components/academy/summer/Problem";
import Solution from "@/components/academy/summer/Solution";
import Offer from "@/components/academy/summer/Offer";
import Risk from "@/components/academy/summer/Risk";
import Enrollment from "@/components/academy/summer/Enrollment";
import FAQ from "@/components/academy/summer/FAQ";
import Contact from "@/components/academy/summer/Contact";
import { getAttributionData, getBrowserData, generateEventId } from "@/lib/metaHelpers";

// Get client IP address (prioritizes IPv6)
const getClientIp = async (): Promise<string> => {
  try {
    // First try to get IPv6 address
    try {
      const ipv6Response = await fetch('https://api64.ipify.org?format=json');
      const ipv6Data = await ipv6Response.json();
      if (ipv6Data.ip && ipv6Data.ip.includes(':')) {
        console.log('🌐 PageView using IPv6 address:', ipv6Data.ip);
        return ipv6Data.ip;
      }
    } catch (ipv6Error) {
      console.warn('PageView IPv6 fetch failed, falling back to IPv4:', ipv6Error);
    }

    // Fallback to IPv4 if IPv6 is not available
    const ipv4Response = await fetch('https://api.ipify.org?format=json');
    const ipv4Data = await ipv4Response.json();
    console.log('🌐 PageView using IPv4 address (IPv6 not available):', ipv4Data.ip);
    return ipv4Data.ip || '0.0.0.0'; 
  } catch (error) {
    console.warn('Could not get client IP:', error);
    return '0.0.0.0';
  }
};

// Track PageView for academy main page
const trackAcademyPageView = async () => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    const eventId = generateEventId();
    
    try {
      // Get client IP
      const clientIp = await getClientIp();
      
      // Get attribution data from URL parameters using centralized function
      const attributionData = getAttributionData();
      
      // Get browser data (includes proper fbc handling)
      const browserData = getBrowserData();
      
      // Fire Facebook Pixel PageView event
      (window as any).fbq('track', 'PageView', {}, { eventID: eventId });
      
      // Send to Meta Conversions API with proper format
      const eventData = {
        event_name: 'PageView',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_id: eventId,
        event_source_url: window.location.href,
        user_data: {
          client_ip_address: clientIp,
          client_user_agent: browserData.userAgent,
          fbc: browserData.fbc || '',
          fbp: browserData.fbp || '',
        },
        attribution_data: {
          ad_id: attributionData.ad_id,
          adset_id: attributionData.adset_id,
          campaign_id: attributionData.campaign_id,
        },
        original_event_data: {
          event_name: 'PageView',
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
              event_name: 'PageView',
              event_id: eventId,
              event_time: Math.floor(Date.now() / 1000),
              user_data: {
                client_ip_address: clientIp,
                client_user_agent: browserData.userAgent,
                fbp: browserData.fbp || '',
                fbc: browserData.fbc || '',
              },
              event_source_url: window.location.href,
              meta_response: result,
            }),
          });
        } catch (sheetError) {
          console.warn('⚠️ PageView sheet logging failed:', sheetError);
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to send PageView event:', response.status, errorText);
        console.error('📋 Event data that failed:', JSON.stringify(eventData, null, 2));
      }
      
    } catch (error) {
      console.error('❌ Failed to track PageView:', error);
    }
  } else {
    console.warn('⚠️ Facebook Pixel not loaded yet');
  }
};

export default function Page() {
  useEffect(() => {
    // Track PageView for the main academy page only
    const timer = setTimeout(() => {
      trackAcademyPageView();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    <noscript>
        <img 
          height="1" 
          width="1" 
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=776602458123489&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
    <div className="text-white space-y-4">
      {/* Floating Urgency Bar */}
      <div className="fixed top-0 left-0 w-full text-white bg-red-500 text-center p-2 z-50 text-sm md:text-base !rounded-none">
        <span className="font-semibold uppercase tracking-wider">
          Offer Ends August 5th!
        </span>
        <span className="font-bold mx-2 hidden md:inline-block">|</span>
        <span className="hidden md:inline-block">
          LESS THAN 30 SLOTS LEFT (SURULERE)!
        </span>
      </div>

      <Hero />
      <Problem />
      <Solution />
      <Offer />
      <Risk />
      <div id="enrollment">
        <Enrollment />
      </div>
      <Contact />
      
      {/* Ensure FAQ is included after Contact */}
      <FAQ />
      <Footer />
    </div>
    </>
  );
} 