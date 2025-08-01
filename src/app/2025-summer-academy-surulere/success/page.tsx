"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, MessageCircle, ArrowRight } from "lucide-react";
import { trackPixelEvent } from "@/lib/metaHelpers";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [isTracked, setIsTracked] = useState(false);
  const [isPurchaseEventSent, setIsPurchaseEventSent] = useState(false);
  
  const eventId = searchParams.get('event_id');
  const paymentRef = searchParams.get('ref');

  useEffect(() => {
    // Send Purchase event to Meta Conversions API (server-side)
    if (eventId && paymentRef && !isPurchaseEventSent) {
      const sendPurchaseEvent = async () => {
        try {
          console.log('🔄 Sending Purchase event to Meta from success page');
          
          const response = await fetch('/api/send-purchase-event', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              eventId,
              paymentReference: paymentRef,
            }),
          });

          const result = await response.json();
          
          if (response.ok) {
            console.log('✅ Purchase event sent successfully:', result);
            setIsPurchaseEventSent(true);
            
            // Clean up sessionStorage backup data after successful Purchase event
            if (typeof window !== 'undefined') {
              const backupKey = `checkout_${eventId}`;
              sessionStorage.removeItem(backupKey);
              console.log('🗑️ Cleaned up backup data from sessionStorage after Purchase event');
            }
          } else {
            console.error('❌ Failed to send Purchase event:', result);
          }
        } catch (error) {
          console.error('❌ Error sending Purchase event:', error);
        }
      };

      sendPurchaseEvent();
    }

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
  }, [eventId, paymentRef, isTracked, isPurchaseEventSent]);

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
            
            <Link
              href="/2025-summer-academy-surulere"
              className="inline-flex items-center justify-center w-full bg-chambray-600 hover:bg-chambray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Back to Academy
            </Link>
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

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mb-8 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
} 