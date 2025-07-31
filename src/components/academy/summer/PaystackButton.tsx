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
  sessionId?: string; // Optional session ID for correlation, not for event deduplication
}

const PaystackButton: React.FC<PaystackButtonProps> = ({
  email,
  amount,
  onSuccess,
  onClose,
  disabled,
  leadData,
  sessionId, // Optional session ID for correlation
}) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string>("");
  const [storedUserData, setStoredUserData] = useState<any>(null);
  const [storedEventId, setStoredEventId] = useState<string>('');
  const [storedSourceUrl, setStoredSourceUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false); // Prevent multiple clicks
  const [hasInitiated, setHasInitiated] = useState(false); // Track if InitiateCheckout already fired

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
    reference: `IC_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`, // Generate unique reference
    email,
    amount: amount * 100, // Amount in kobo
    publicKey: publicKey || "",
  };

  const initializePayment = usePaystackPayment(config);

  const handleClick = async () => {
    if (disabled || !isReady || error || isProcessing) {
      return;
    }

    // Prevent multiple clicks and duplicate InitiateCheckout events
    if (hasInitiated) {
      console.log('🚫 InitiateCheckout already fired for this session, skipping duplicate');
      // Just initialize payment without firing another event
      try {
        setIsProcessing(true);
        initializePayment({ 
          onSuccess: (reference) => {
            // Retrieve backup data from sessionStorage
            let backupData = null;
            if (typeof window !== 'undefined') {
              const backupKey = `checkout_${storedEventId || 'fallback'}`;
              const storedBackup = sessionStorage.getItem(backupKey);
              if (storedBackup) {
                try {
                  backupData = JSON.parse(storedBackup);
                  console.log('📦 Retrieved backup data from sessionStorage');
                } catch (e) {
                  console.warn('⚠️ Failed to parse backup data from sessionStorage');
                }
              }
            }

            // Add the stored user data to the reference object for payment verification
            const enhancedReference = {
              ...reference,
              originalUserData: storedUserData,
              eventId: storedEventId,
              eventSourceUrl: storedSourceUrl,
              backupData: backupData // Include backup data
            };
            
            console.log('💳 Payment successful (no duplicate event), passing enhanced reference:', {
              reference: reference.reference,
              hasUserData: !!storedUserData,
              eventId: storedEventId,
              userDataKeys: storedUserData ? Object.keys(storedUserData) : []
            });
            
            setIsProcessing(false);
            onSuccess(enhancedReference);
          }, 
          onClose: () => {
            setIsProcessing(false);
            onClose();
          }
        });
      } catch (err) {
        console.error('Error initializing payment (duplicate prevention):', err);
        setError("Failed to initialize payment");
        setIsProcessing(false);
      }
      return;
    }

    setIsProcessing(true);

    // Fire InitiateCheckout event when user clicks "ENROLL NOW" (only once)
    if (leadData) { // User data is required
      // Use the SAME event ID from the form (don't generate new one)
      const initiateCheckoutEventId = leadData.eventId;
      
      console.log('🎯 Using form eventId for InitiateCheckout:', {
        eventId: initiateCheckoutEventId,
        source: 'reused from form leadData'
      });
      
      // Mark as initiated to prevent duplicates
      setHasInitiated(true);
      
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
          event_id: initiateCheckoutEventId, // Use the unique InitiateCheckout event ID
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

        // Store the checkout data in in-memory store for Purchase event
        try {
          const storePayload = {
            eventId: initiateCheckoutEventId, // Use the unique InitiateCheckout event ID
            userData: conversionData.user_data,
            sourceUrl: leadData.sourceUrl,
            leadInfo: {
              email: leadData.email,
              name: leadData.name,
              phone: leadData.phone,
              fbp: leadData.fbp,
              fbc: leadData.fbc,
              userAgent: leadData.userAgent,
              clientIp: leadData.clientIp
            }
          };

          // Store in server memory
          await fetch('/api/store-checkout-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(storePayload),
          });

          // Also store in sessionStorage as backup
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(`checkout_${initiateCheckoutEventId}`, JSON.stringify(storePayload));
            console.log('💾 Backup stored in sessionStorage for eventId:', initiateCheckoutEventId);
          }

          console.log('✅ Stored checkout data in memory for Purchase event');
        } catch (storeError) {
          console.warn('⚠️ Failed to store checkout data:', storeError);
        }

        // Legacy state storage (keeping for compatibility)
        setStoredUserData(conversionData.user_data);
        setStoredEventId(initiateCheckoutEventId); // Store the InitiateCheckout event ID
        setStoredSourceUrl(leadData.sourceUrl);
        
        console.log('💾 Stored user data for payment verification:', {
          eventId: initiateCheckoutEventId,
          userData: conversionData.user_data,
          sourceUrl: leadData.sourceUrl
        });

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
                event_id: initiateCheckoutEventId, // Use the unique InitiateCheckout event ID
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
          setHasInitiated(false); // Reset if failed
        }
      } catch (conversionError) {
        console.error('InitiateCheckout conversion failed:', conversionError);
        setHasInitiated(false); // Reset if failed
        // Don't fail the payment initialization if conversion tracking fails
      }
    } else {
      console.warn('🚫 No leadData or eventId provided - cannot fire InitiateCheckout event');
      setIsProcessing(false);
      return;
    }

    try {
      initializePayment({ 
        onSuccess: (reference) => {
          // Retrieve backup data from sessionStorage
          let backupData = null;
          if (typeof window !== 'undefined') {
            const backupKey = `checkout_${storedEventId || 'fallback'}`;
            const storedBackup = sessionStorage.getItem(backupKey);
            if (storedBackup) {
              try {
                backupData = JSON.parse(storedBackup);
                console.log('📦 Retrieved backup data from sessionStorage');
              } catch (e) {
                console.warn('⚠️ Failed to parse backup data from sessionStorage');
              }
            }
          }

          // Add the stored user data to the reference object for payment verification
          const enhancedReference = {
            ...reference,
            originalUserData: storedUserData,
            eventId: storedEventId,
            eventSourceUrl: storedSourceUrl,
            backupData: backupData // Include backup data
          };
          
          console.log('💳 Payment successful, passing enhanced reference:', {
            reference: reference.reference,
            hasUserData: !!storedUserData,
            eventId: storedEventId,
            userDataKeys: storedUserData ? Object.keys(storedUserData) : []
          });
          
          setIsProcessing(false);
          onSuccess(enhancedReference);
        }, 
        onClose: () => {
          setIsProcessing(false);
          onClose();
        }
      });
    } catch (err) {
      console.error('Error initializing Paystack:', err);
      setError("Failed to initialize payment");
      setIsProcessing(false);
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
      disabled={disabled || !isReady || isProcessing}
      className={`font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 ${
        disabled || !isReady || isProcessing
          ? 'bg-gray-400 text-gray-200 opacity-75 cursor-not-allowed'
          : 'bg-chambray-700 hover:bg-chambray-800 text-white cursor-pointer hover:scale-105'
      }`}
    >
      {isProcessing ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : disabled ? 'Complete Form First' : 'ENROLL NOW - ₦50,000'}
    </button>
  );
};

export default PaystackButton; 