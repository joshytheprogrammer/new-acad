"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Footer from "@/components/Footer";
import Hero from "@/components/academy/summer/Hero";
import Problem from "@/components/academy/summer/Problem";
import Solution from "@/components/academy/summer/Solution";
import Offer from "@/components/academy/summer/Offer";
import Risk from "@/components/academy/summer/Risk";
import Enrollment from "@/components/academy/summer/Enrollment";
import FAQ from "@/components/academy/summer/FAQ";
import Contact from "@/components/academy/summer/Contact";
import { getAttributionData, getBrowserData, generateEventId, getTestEventCode, trackPixelEvent } from "@/lib/metaHelpers";
import { Star, CheckCircle, MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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

// Success Content Component
function SuccessContent({ eventId, paymentRef }: { eventId: string; paymentRef: string }) {
  const [isTracked, setIsTracked] = useState(false);

  useEffect(() => {
    // Fire deduplicated Purchase pixel event for frontend tracking
    if (eventId && !isTracked) {
      trackPixelEvent('Purchase', {
        value: 50000,
        currency: 'NGN',
        content_name: '2025 Summer Academy - Surulere',
        content_category: 'Education',
        content_ids: ['summer-academy-2025'],
        num_items: 1
      }, eventId); // Same event_id used in Conversions API for deduplication
      
      setIsTracked(true);
    }
  }, [eventId, isTracked]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-24 h-24 text-green-500" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🎉 Enrollment Successful!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Congratulations! Your child's spot in the 2025 Summer Academy (Surulere) 
            has been <span className="font-semibold text-green-600">secured</span>.
          </p>

          {/* Payment Details */}
          {paymentRef && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-green-800">
                <span className="font-semibold">Payment Reference:</span> {paymentRef}
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-bold text-gray-900 mb-4 text-center">What Happens Next?</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  1
                </div>
                <p className="text-gray-700">
                  You'll receive a confirmation email with program details within 24 hours.
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  2
                </div>
                <p className="text-gray-700">
                  We'll add you to the exclusive WhatsApp group for updates and communication.
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  3
                </div>
                <p className="text-gray-700">
                  Program starts August 5th, 2025 at our Surulere location (33, Adegoke Street).
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <a
              href="https://wa.me/2348081787841?text=Hi! I just enrolled my child in the 2025 Summer Academy. Looking forward to the program!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-300 group"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              Join WhatsApp Group
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  // Remove success params from URL without page reload
                  const url = new URL(window.location.href);
                  url.searchParams.delete('success');
                  url.searchParams.delete('event_id');
                  url.searchParams.delete('ref');
                  window.history.replaceState({}, '', url.toString());
                  window.location.reload();
                }
              }}
              className="inline-flex items-center justify-center w-full bg-chambray-600 hover:bg-chambray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Back to Academy
            </button>
          </div>

          {/* Support Contact */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Questions or need support? Contact us at{" "}
              <a 
                href="mailto:info@wandgroup.com" 
                className="text-blue-600 hover:underline"
              >
                info@wandgroup.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Page Content Component  
function MainPageContent() {
  return (
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
  );
}

// URL Parameters Component
function PageContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const eventId = searchParams.get('event_id');
  const paymentRef = searchParams.get('ref');

  // Show success content if success params are present
  if (isSuccess && eventId && paymentRef) {
    return <SuccessContent eventId={eventId} paymentRef={paymentRef} />;
  }

  // Show main page content by default
  return <MainPageContent />;
}

export default function Page() {
  useEffect(() => {
    // Track PageView for the main academy page only
    // Don't track on success page to avoid duplicate PageView events
    const searchParams = new URLSearchParams(window.location.search);
    const isSuccess = searchParams.get('success') === 'true';
    
    if (!isSuccess) {
      const timer = setTimeout(() => {
        trackAcademyPageView();
      }, 2000);

      return () => clearTimeout(timer);
    }
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
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <PageContent />
      </Suspense>
    </>
  );
} 