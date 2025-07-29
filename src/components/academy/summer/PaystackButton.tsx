"use client";
import React, { useEffect, useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { 
  generateEventId, 
  trackPixelEvent,
  getAttributionData,
  type LeadData 
} from "@/lib/metaHelpers";

interface PaystackReference {
  message: string;
  reference: string;
  status: "success" | "failure";
  trans: string;
  transaction: string;
  trxref: string;
}

interface PaystackButtonProps {
  email: string;
  amount: number;
  onSuccess: (reference: PaystackReference) => void;
  onClose: () => void;
  disabled?: boolean;
  leadData?: LeadData; // Add leadData prop for InitiateCheckout tracking
}

const PaystackButton: React.FC<PaystackButtonProps> = ({
  email,
  amount,
  onSuccess,
  onClose,
  disabled,
  leadData,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string>("");

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  // Check if Paystack is properly configured
  useEffect(() => {
    if (!publicKey) {
      setError("Paystack configuration missing");
      console.error("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY not found in environment variables");
      return;
    }

    if (!email) {
      setError("Email is required");
      return;
    }

    if (amount <= 0) {
      setError("Invalid amount");
      return;
    }

    setIsReady(true);
    setError("");
  }, [email, amount, publicKey]);

  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100, // Amount in kobo
    publicKey: publicKey || "",
  };

  const initializePayment = usePaystackPayment(config);

  const handleClick = async () => {
    if (disabled || !isReady || error) {
      return;
    }

    // Fire InitiateCheckout event when user clicks "ENROLL NOW"
    if (leadData) {
      const initiateCheckoutEventId = generateEventId();
      
      // 1. Frontend Pixel Event
      trackPixelEvent('InitiateCheckout', {
        value: 50000,
        currency: 'NGN',
        content_name: '2025 Summer Academy - Surulere',
        content_category: 'Education',
        content_ids: ['summer-academy-2025'],
        num_items: 1
      }, initiateCheckoutEventId);
      
      // 2. Backend Conversions API Event (for better tracking)
      try {
        // Hash the user data according to Meta requirements
        const crypto = await import('crypto');
        
        const hashedEmail = crypto
          .createHash('sha256')
          .update(leadData.email.toLowerCase().trim())
          .digest('hex');
          
        const cleanPhone = leadData.phone.replace(/\D/g, '');
        const phoneWithCountryCode = cleanPhone.startsWith('234') 
          ? cleanPhone 
          : `234${cleanPhone.replace(/^0/, '')}`;
        const hashedPhone = crypto
          .createHash('sha256')
          .update(phoneWithCountryCode)
          .digest('hex');

        const hashedName = crypto
          .createHash('sha256')
          .update(leadData.name.toLowerCase().trim())
          .digest('hex');

        const attributionData = getAttributionData();

        const conversionData = {
          event_name: 'InitiateCheckout',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_id: initiateCheckoutEventId,
          event_source_url: leadData.sourceUrl,
          user_data: {
            em: [hashedEmail],
            ph: [hashedPhone],
            fn: [hashedName],
            client_ip_address: leadData.clientIp,
            client_user_agent: leadData.userAgent,
            fbp: leadData.fbp,
            fbc: leadData.fbc,
            external_id: [hashedEmail]
          },
          attribution_data: {
            ad_id: attributionData.ad_id,
            adset_id: attributionData.adset_id,
            campaign_id: attributionData.campaign_id,
          },
          custom_data: {
            value: 50000,
            currency: 'NGN',
          },
          original_event_data: {
            event_name: 'InitiateCheckout',
            event_time: Math.floor(Date.now() / 1000)
          }
        };

        // Send to our meta-conversion endpoint (credentials will be handled server-side)
        const conversionResponse = await fetch(`/api/meta-conversion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(conversionData),
        });

        if (conversionResponse.ok) {
          const result = await conversionResponse.json();
          console.log('✅ InitiateCheckout event tracked successfully:', result);
          
          // Log to SheetDB for comprehensive tracking
          try {
            const attributionDataForSheet = getAttributionData();
            await fetch('/api/log-meta-event', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                event_name: 'InitiateCheckout',
                event_id: initiateCheckoutEventId,
                event_time: Math.floor(Date.now() / 1000),
                user_data: {
                  em: [hashedEmail],
                  ph: [hashedPhone],
                  fn: [hashedName],
                  client_ip_address: leadData.clientIp,
                  client_user_agent: leadData.userAgent,
                  fbp: leadData.fbp,
                  fbc: leadData.fbc,
                },
                custom_data: {
                  value: 50000,
                  currency: 'NGN',
                },
                event_source_url: leadData.sourceUrl,
                source_info: {
                  page_path: typeof window !== 'undefined' ? window.location.pathname : '',
                  referrer: typeof document !== 'undefined' ? document.referrer : '',
                  utm_source: attributionDataForSheet.utm_source || '',
                  utm_medium: attributionDataForSheet.utm_medium || '',
                  utm_campaign: attributionDataForSheet.utm_campaign || '',
                  utm_term: attributionDataForSheet.utm_term || '',
                  utm_content: attributionDataForSheet.utm_content || '',
                  fbclid: attributionDataForSheet.fbclid || '',
                  gclid: attributionDataForSheet.gclid || '',
                },
                meta_response: result,
                additional_data: { 
                  form_data: { 
                    name: leadData.name, 
                    email: leadData.email, 
                    phone: leadData.phone 
                  } 
                }
              }),
            });
          } catch (sheetError) {
            console.warn('⚠️ InitiateCheckout sheet logging failed:', sheetError);
          }
        } else {
          console.error('❌ InitiateCheckout conversion failed');
        }
      } catch (conversionError) {
        console.error('InitiateCheckout conversion failed:', conversionError);
        // Don't fail the payment initialization if conversion tracking fails
      }
    }

    try {
      initializePayment({ 
        onSuccess: (reference) => {
          onSuccess(reference);
        }, 
        onClose: () => {
          onClose();
        }
      });
    } catch (err) {
      console.error('Error initializing Paystack:', err);
      setError("Failed to initialize payment");
    }
  };

  // Show error state
  if (error) {
    return (
      <div className="text-center">
        <button
          disabled
          className="bg-red-500 text-white font-bold py-4 px-8 rounded-lg text-xl opacity-75 cursor-not-allowed"
        >
          Payment Error
        </button>
        <p className="text-red-500 text-sm mt-2">{error}</p>
        {process.env.NODE_ENV === 'development' && (
          <p className="text-xs text-gray-500 mt-1">
            Check console for details
          </p>
        )}
      </div>
    );
  }

  // Show loading state
  if (!isReady) {
    return (
      <button
        disabled
        className="bg-gray-400 text-white font-bold py-4 px-8 rounded-lg text-xl opacity-75 cursor-not-allowed"
      >
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading Payment...
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || !isReady}
      className={`font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 ${
        disabled || !isReady
          ? 'bg-gray-400 text-gray-200 opacity-75 cursor-not-allowed'
          : 'bg-chambray-700 hover:bg-chambray-800 text-white cursor-pointer hover:scale-105'
      }`}
    >
      {disabled ? 'Complete Form First' : 'ENROLL NOW - ₦50,000'}
    </button>
  );
};

export default PaystackButton; 