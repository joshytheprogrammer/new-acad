"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, MessageCircle, ArrowRight } from "lucide-react";
import { trackPixelEvent } from "@/lib/metaHelpers";
import Image from "next/image";

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
          console.log('📊 Request data:', {
            eventId,
            paymentReference: paymentRef,
            eventIdType: typeof eventId,
            paymentRefType: typeof paymentRef
          });
          
          const requestBody = {
            eventId,
            paymentReference: paymentRef,
          };
          
          console.log('📨 Full request body:', requestBody);
          
          const response = await fetch('/api/send-purchase-event', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          const result = await response.json();
          
          console.log('📈 Purchase event response:', {
            status: response.status,
            ok: response.ok,
            result: result
          });
          
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Celebration Header */}
          <div className="p-8 text-center relative">
            {/* Celebration Cone Graphic */}
            <div className="flex justify-center">
             <Image src="/images/purchase.png" alt="Celebration Cone" width={500} height={500} className="mx-auto mb-4 size-36" />
            </div>

            <h1 className="text-2xl font-bold text-chambray-600 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600  leading-relaxed">
              Congratulations! Your child's spot is now secured at Walls & Gates Academy.
            </p>
          </div>

          {/* What Happens Next Section */}
          <div className="px-8 pb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What Happens Next?
            </h2>

            <div className="space-y-4">

              {/* Step 2: WhatsApp Group */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900  mb-1">
                    WhatsApp Group Invitation (Within 24 hours)
                  </h3>
                  <p className="text-gray-600  leading-relaxed">
                    Join our exclusive parent group for updates, photos, and direct communication with instructors.
                  </p>
                </div>
              </div>

              {/* Step 3: Program Day */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900  mb-1">
                    Program Day - Starts August 12th, 8:00 AM
                  </h3>
                  <p className="text-gray-600  leading-relaxed">
                    Arrive 15 minutes early. Bring your child's laptop (or we'll provide one) and a notebook.
                  </p>
                </div>
              </div>
            </div>

            {/* Download Receipt Button */}
            <div className="mt-8">
            <Link href="https://chat.whatsapp.com/Jqto6qxuFfDIyci3LMp41U" target="_blank" className="block">
              <button      className="cursor-pointer w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-300"
              >
                Join WhatsApp Group
              </button>
            </Link>
            <Link href="/2025-summer-academy-surulere" target="_blank" className="mt-4 block">
              <button      className="cursor-pointer w-full bg-chambray-700 hover:bg-chambray-800 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-300"
              >
                Back to Home
              </button>
            </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="mx-auto text-center">
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