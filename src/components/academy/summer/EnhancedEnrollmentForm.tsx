"use client";

import { useState, useEffect } from "react";
import { UserIcon, MailIcon, PhoneIcon } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { 
  generateEventId, 
  getBrowserData, 
  getClientIp, 
  trackPixelEvent,
  getAttributionData,
  getTestEventCode,
  type LeadData 
} from "@/lib/metaHelpers";

// Dynamically import PaystackButton to avoid SSR issues
const PaystackButton = dynamic(() => import("./PaystackButton"), {
  ssr: false,
  loading: () => (
    <button 
      disabled 
      className="bg-chambray-700 text-white font-bold py-4 px-8 rounded-lg text-xl opacity-50 cursor-not-allowed"
    >
      Loading...
    </button>
  ),
});

interface PaystackReference {
  message: string;
  reference: string;
  status: "success" | "failure";
  trans: string;
  transaction: string;
  trxref: string;
}

interface EnhancedEnrollmentFormProps {
  onSuccess?: (reference: PaystackReference) => void;
  onClose?: () => void;
}

export default function EnhancedEnrollmentForm({ 
  onSuccess, 
  onClose 
}: EnhancedEnrollmentFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: ""
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string>("");
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasInitiatedCheckout, setHasInitiatedCheckout] = useState(false);
  const [formSubmissionCount, setFormSubmissionCount] = useState(0); // Track form submissions

  // Reset function for error recovery
  const resetFormState = () => {
    setShowPayment(false);
    setHasInitiatedCheckout(false);
    setCurrentEventId("");
    setLeadData(null);
    setFormSubmissionCount(0);
    console.log('🔄 Form state reset for error recovery');
  };

  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // Validate form fields with detailed feedback
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+?234|0)?[789]\d{9}$/;
    
    const errors = { name: "", email: "", phone: "" };
    
    // Validate name
    if (formData.name.trim().length > 0 && formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    
    // Validate email
    if (formData.email.length > 0 && !emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Validate phone
    if (formData.phone.length > 0) {
      const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        errors.phone = "Enter valid Nigerian number (e.g., 08012345678)";
      }
    }
    
    setValidationErrors(errors);
    
    // Form is valid if all fields are filled and no errors
    const isValid = 
      formData.name.trim().length >= 2 &&
      emailRegex.test(formData.email) &&
      phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, '')) &&
      !errors.name && !errors.email && !errors.phone;
    
    setIsFormValid(isValid);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Reset checkout state if user changes email (key identifier)
    // But preserve eventId to prevent duplicates if they change back
    if (name === 'email' && hasInitiatedCheckout) {
      setHasInitiatedCheckout(false);
      setShowPayment(false);
      // Don't reset currentEventId - keep it for consistency
      setLeadData(null);
      console.log('🔄 Email changed, reset checkout state but preserved eventId');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid || isSubmitting) return;
    
    // Prevent duplicate submissions for the same user data
    if (hasInitiatedCheckout && currentEventId && leadData) {
      // Check if it's the same user data
      const sameUserData = leadData.email === formData.email && 
                          leadData.name === formData.name && 
                          leadData.phone === formData.phone;
      
      if (sameUserData) {
        // If already processed with same data, just show payment section
        setShowPayment(true);
        toast.success("Payment section loaded! Click 'ENROLL NOW' to proceed.");
        return;
      } else {
        // Different data - allow new submission but warn about potential duplicate
        console.log('⚠️ User data changed, allowing new submission');
      }
    }
    
    setIsSubmitting(true);
    setFormSubmissionCount(prev => prev + 1);
    
    try {
      // Generate unique event ID only once for this enrollment attempt
      let eventId = currentEventId;
      if (!eventId) {
        eventId = generateEventId();
        setCurrentEventId(eventId);
        console.log('🆔 Generated new eventId:', eventId);
      } else {
        console.log('🔄 Reusing existing eventId:', eventId);
      }
      
      // Get browser data and client IP
      const browserData = getBrowserData();
      const clientIp = await getClientIp();
      
      // Create lead data object
      const leadInfo: LeadData = {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        eventId,
        fbp: browserData.fbp,
        fbc: browserData.fbc,
        userAgent: browserData.userAgent,
        clientIp,
        sourceUrl: browserData.sourceUrl,
        timestamp: new Date().toISOString()
      };
      
      setLeadData(leadInfo);
      
      // Only store lead data and fire tracking events if not already done
      if (!hasInitiatedCheckout) {
        // Store lead data with status PENDING
        const storeResponse = await fetch('/api/store-lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leadInfo),
        });
        
        if (!storeResponse.ok) {
          throw new Error('Failed to store lead data');
        }
        
      // Fire ViewContent event only if not already initiated
      if (!hasInitiatedCheckout) {
        // Generate unique event ID for ViewContent
        const viewContentEventId = generateEventId();
        
        // Check for test mode
        const testEventCode = getTestEventCode();
        
        if (testEventCode) {
          console.log('🧪 ViewContent - Test mode detected:', testEventCode);
        } else {
          console.log('🏭 ViewContent - Production mode');
        }
        
        // Fire ViewContent event when user proceeds to payment section
        // 1. Frontend Pixel Event
        trackPixelEvent('ViewContent', {
          content_name: '2025 Summer Academy - Surulere',
          content_category: 'Education',
          content_ids: ['summer-academy-2025'],
          content_type: 'product'
        }, viewContentEventId);        // 2. Backend Conversions API Event (for better tracking)
        try {
          // Hash the user data according to Meta requirements
          const crypto = await import('crypto');
          
          const hashedEmail = crypto
            .createHash('sha256')
            .update(leadInfo.email.toLowerCase().trim())
            .digest('hex');
            
          const cleanPhone = leadInfo.phone.replace(/\D/g, '');
          const phoneWithCountryCode = cleanPhone.startsWith('234') 
            ? cleanPhone 
            : `234${cleanPhone.replace(/^0/, '')}`;
          const hashedPhone = crypto
            .createHash('sha256')
            .update(phoneWithCountryCode)
            .digest('hex');

          const hashedName = crypto
            .createHash('sha256')
            .update(leadInfo.name.toLowerCase().trim())
            .digest('hex');

          const attributionData = getAttributionData();

          const conversionData = {
            event_name: 'ViewContent',
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            event_id: viewContentEventId,
            event_source_url: leadInfo.sourceUrl,
            user_data: {
              em: [hashedEmail],
              ph: [hashedPhone],
              fn: [hashedName],
              client_ip_address: leadInfo.clientIp,
              client_user_agent: leadInfo.userAgent,
              fbp: leadInfo.fbp,
              fbc: leadInfo.fbc,
              external_id: [hashedEmail]
            },
            attribution_data: {
              ad_id: attributionData.ad_id,
              adset_id: attributionData.adset_id,
              campaign_id: attributionData.campaign_id,
            },
            custom_data: {
              content_name: '2025 Summer Academy - Surulere',
              content_category: 'Education',
              content_ids: ['summer-academy-2025'],
              content_type: 'product'
            },
            original_event_data: {
              event_name: 'ViewContent',
              event_time: Math.floor(Date.now() / 1000)
            },
            // Include test event code if detected
            ...(testEventCode && { test_event_code: testEventCode }),
          };

          // Send to our meta-conversion endpoint (credentials will be handled server-side)
          const conversionResponse = await fetch(`/api/meta-conversion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(conversionData),
          });

          if (conversionResponse.ok) {
            const result = await conversionResponse.json();
            console.log('✅ ViewContent event tracked successfully:', result);
            
            // Log to SheetDB for comprehensive tracking
            try {
              const attributionData = getAttributionData();
              await fetch('/api/log-meta-event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  event_name: 'ViewContent',
                  event_id: viewContentEventId,
                  event_time: Math.floor(Date.now() / 1000),
                  user_data: {
                    em: [hashedEmail],
                    ph: [hashedPhone],
                    fn: [hashedName],
                    client_ip_address: leadInfo.clientIp,
                    client_user_agent: leadInfo.userAgent,
                    fbp: leadInfo.fbp,
                    fbc: leadInfo.fbc,
                    external_id: [hashedEmail],
                  },
                  custom_data: {
                    value: 50000,
                    currency: 'NGN',
                  },
                  event_source_url: leadInfo.sourceUrl,
                  meta_response: result,
                  additional_data: { 
                    form_data: { 
                      name: leadInfo.name, 
                      email: leadInfo.email, 
                      phone: leadInfo.phone 
                    } 
                  }
                }),
              });
            } catch (sheetError) {
              console.warn('⚠️ ViewContent sheet logging failed:', sheetError);
            }
          } else {
            console.error('❌ ViewContent conversion failed');
          }
        } catch (conversionError) {
          console.error('ViewContent conversion failed:', conversionError);
          // Don't fail the form submission if conversion tracking fails
        }
        
        // Mark that we've initiated checkout to prevent duplicates
        setHasInitiatedCheckout(true);
        console.log('✅ Form submission completed - hasInitiatedCheckout set to true');
      } else {
        console.log('⏭️ ViewContent event skipped - already initiated checkout');
      }
      }
      
      // Show payment section
      setShowPayment(true);
      
      toast.success("Payment section loaded! Click 'ENROLL NOW' to proceed.");
      
    } catch (error) {
      console.error('Error processing form:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaystackSuccess = async (reference: PaystackReference) => {
    try {
      // Show loading state
      toast.loading("Verifying payment...");
      
      const verifyPayload = {
        reference: reference.reference,
        eventId: (reference as any).eventId || currentEventId,
        originalUserData: (reference as any).originalUserData,
        eventSourceUrl: (reference as any).eventSourceUrl,
        backupData: (reference as any).backupData, // Include backup data
      };
      
      console.log('🔍 Sending payment verification with data:', {
        reference: verifyPayload.reference,
        eventId: verifyPayload.eventId,
        currentEventIdFromForm: currentEventId,
        eventIdMatch: verifyPayload.eventId === currentEventId,
        hasOriginalUserData: !!verifyPayload.originalUserData,
        hasBackupData: !!verifyPayload.backupData,
        originalUserDataKeys: verifyPayload.originalUserData ? Object.keys(verifyPayload.originalUserData) : [],
        eventSourceUrl: verifyPayload.eventSourceUrl
      });
      
      console.log('🎯 EVENT ID TRACING - Form to Payment Verification:', {
        formCurrentEventId: currentEventId,
        paymentReferenceEventId: (reference as any).eventId,
        verifyPayloadEventId: verifyPayload.eventId,
        allMatch: currentEventId === (reference as any).eventId && currentEventId === verifyPayload.eventId
      });
      
      // Verify payment with our backend, including original user data
      const verifyResponse = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verifyPayload),
      });

      const verifyResult = await verifyResponse.json();

      if (verifyResult.success) {
        toast.dismiss();
        toast.success("Payment verified successfully!");
        
        // Clean up sessionStorage backup data
        if (typeof window !== 'undefined') {
          const backupKey = `checkout_${currentEventId}`;
          sessionStorage.removeItem(backupKey);
          console.log('🗑️ Cleaned up backup data from sessionStorage');
        }
        
        if (onSuccess) {
          onSuccess(reference);
        }
        
        // Redirect to success page with event ID for deduplication
        window.location.href = `/2025-summer-academy-surulere/success?event_id=${currentEventId}&ref=${reference.reference}`;
      } else {
        toast.dismiss();
        toast.error("Payment verification failed. Please contact support.");
        console.error('Payment verification failed:', verifyResult.error);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Error verifying payment. Please contact support.");
      console.error('Payment verification error:', error);
    }
  };

  const handlePaystackClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (showPayment && leadData && currentEventId) {
    return (
      <div className="space-y-6">
        <div className="bg-chambray-50 border border-chambray-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-chambray-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-chambray-800 font-medium">Details Confirmed</span>
          </div>
          <p className="text-chambray-700 text-sm mt-1">
            {formData.name}, complete your ₦50,000 enrollment payment below.
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <PaystackButton
            email={leadData.email}
            amount={50000}
            onSuccess={handlePaystackSuccess}
            onClose={handlePaystackClose}
            disabled={false}
            leadData={leadData}
          />
          
          <button
            onClick={() => {
              // Only allow going back to edit if no payment has been attempted
              console.log('🔙 Edit Details clicked');
              setShowPayment(false);
              // Don't reset hasInitiatedCheckout to prevent duplicate events
              // setHasInitiatedCheckout(false); // Removed to prevent duplicate tracking
              // Keep eventId and leadData to maintain consistency
            }}
            className="mt-4 text-sm text-gray-600 hover:text-gray-800 underline"
          >
            ← Edit Details
          </button>
        </div>
      </div>
    );
  }

  // Error state if payment section is requested but eventId is missing
  if (showPayment && leadData && !currentEventId) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800 font-medium">Setup Error</span>
          </div>
          <p className="text-red-700 text-sm mt-1">
            Missing tracking ID. Please submit the form again.
          </p>
        </div>
        
        <button
          onClick={() => {
            setShowPayment(false);
            setHasInitiatedCheckout(false);
            setLeadData(null);
            setCurrentEventId("");
          }}
          className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
        >
          ← Return to Form
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Parent Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Parent/Guardian Name *
        </label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your full name"
            required
            className={`w-full bg-gray-50 text-black rounded-lg pl-10 pr-3 py-3 outline-none border-2 transition-colors placeholder-gray-500 ${
              validationErrors.name 
                ? 'border-red-300 focus:border-red-500' 
                : formData.name.trim().length >= 2
                ? 'border-chambray-300 focus:border-chambray-500'
                : 'border-gray-200 focus:border-chambray-500'
            }`}
          />
        </div>
        {validationErrors.name && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <div className="relative">
          <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            required
            className={`w-full bg-gray-50 text-black rounded-lg pl-10 pr-3 py-3 outline-none border-2 transition-colors placeholder-gray-500 ${
              validationErrors.email 
                ? 'border-red-300 focus:border-red-500' 
                : formData.email.includes('@') && !validationErrors.email
                ? 'border-chambray-300 focus:border-chambray-500'
                : 'border-gray-200 focus:border-chambray-500'
            }`}
          />
        </div>
        {validationErrors.email && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <div className="relative">
          <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="08012345678 or +2348012345678"
            required
            className={`w-full bg-gray-50 text-black rounded-lg pl-10 pr-3 py-3 outline-none border-2 transition-colors placeholder-gray-500 ${
              validationErrors.phone 
                ? 'border-red-300 focus:border-red-500' 
                : formData.phone.length > 8 && !validationErrors.phone
                ? 'border-chambray-300 focus:border-chambray-500'
                : 'border-gray-200 focus:border-chambray-500'
            }`}
          />
        </div>
        {validationErrors.phone ? (
          <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">
            We'll send updates and WhatsApp group link to this number
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isFormValid || isSubmitting || formSubmissionCount > 3}
        className={`w-full font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 ${
          isFormValid && !isSubmitting && formSubmissionCount <= 3
            ? 'bg-chambray-700 hover:bg-chambray-800 text-white cursor-pointer'
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : formSubmissionCount > 3 ? (
          "TOO MANY ATTEMPTS"
        ) : (
          "PROCEED TO PAYMENT →"
        )}
      </button>

      {/* Multiple submission warning */}
      {formSubmissionCount > 3 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm mb-2">
            ⚠️ Multiple submission attempts detected. This prevents duplicate events.
          </p>
          <button
            onClick={resetFormState}
            className="text-chambray-600 hover:text-chambray-800 underline text-sm"
          >
            Reset Form
          </button>
        </div>
      )}

      {/* Form Status */}
      {!isFormValid && (formData.name || formData.email || formData.phone) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-yellow-800 text-sm">
            ⚠️ Please complete all fields correctly to proceed to payment
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        By proceeding, you agree to our terms. Your payment is secured by Paystack.
      </p>
    </form>
  );
} 