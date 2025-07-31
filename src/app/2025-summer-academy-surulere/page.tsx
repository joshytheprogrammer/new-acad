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
import { getAttributionData, getBrowserData, generateEventId, getTestEventCode } from "@/lib/metaHelpers";
import { Star } from 'lucide-react';

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
      
      // Check for test mode from URL parameters
      const testEventCode = getTestEventCode();
      
      if (testEventCode) {
        console.log('🧪 PageView - Test mode detected:', testEventCode);
      } else {
        console.log('🏭 PageView - Production mode');
      }
      
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
        },
        // Include test event code if detected
        ...(testEventCode && { test_event_code: testEventCode }),
      };      const response = await fetch('/api/meta-conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ PageView event sent to Meta successfully:', result);
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
          src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    <div className="space-y-2 md:space-y-4 px-4 bg-slate-50">
      {/* Floating Urgency Bar */}
      <div className="fixed top-0 left-0 w-full text-white font-semibold bg-gradient-to-r from-[#FF4671] to-[#FFBC33] text-center p-3 z-50 lg:text-lg !rounded-none flex items-center justify-center gap-4">
        <Star className="w-5 h-5 text-white" fill="currentColor" />
        <span className="text-lg">OFFER ENDS AUGUST 5TH!</span>
        <span className='hidden lg:inline'> | </span>
        <span className='hidden lg:inline'>LESS THAN 30 SLOTS LEFT (SURULERE)!</span>
        <Star className="w-5 h-5 text-white" fill="currentColor" />
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