"use client";
import { useState } from "react";
import { getAttributionData, getBrowserData, generateEventId } from "@/lib/metaHelpers";

// Helper function to hash data using Web Crypto API
const hashData = async (data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus("idle");

        // Debug logging
        console.log('📋 Form submission data:', formData);

        try {
            // Track form submission with Meta Conversions API
            const eventId = generateEventId();
            
            // Fire Facebook Pixel Contact event
            if (typeof window !== 'undefined' && (window as any).fbq) {
                (window as any).fbq('track', 'Contact', {
                    content_name: 'Contact Form Submission',
                    content_category: 'Academy Inquiry'
                }, { eventID: eventId });
            }
            
            // Get client IP
            const clientIp = await getClientIp();
            
            // Get attribution data from URL parameters
            const attributionData = getAttributionData();
            
            // Get browser data (includes proper fbc handling)
            const browserData = getBrowserData();
            
            // Hash PII data for Meta API compliance
            const hashedEmail = await hashData(formData.email);
            const hashedPhone = await hashData(formData.phone);
            const firstName = formData.name.split(' ')[0];
            const lastName = formData.name.split(' ').slice(1).join(' ') || formData.name.split(' ')[0];
            const hashedFirstName = await hashData(firstName);
            const hashedLastName = await hashData(lastName);
            
            
            // Prepare data for Meta Conversions API with proper format
            const eventData = {
                event_name: 'Contact',
                event_time: Math.floor(Date.now() / 1000),
                action_source: 'website',
                event_id: eventId,
                event_source_url: window.location.href,
                user_data: {
                    em: [hashedEmail], // Hashed email
                    ph: [hashedPhone], // Hashed phone
                    fn: [hashedFirstName], // Hashed first name
                    ln: [hashedLastName], // Hashed last name
                    client_ip_address: clientIp,
                    client_user_agent: browserData.userAgent,
                    fbc: browserData.fbc || '',
                    fbp: browserData.fbp || ''
                },
                attribution_data: {
                    ad_id: attributionData.ad_id,
                    adset_id: attributionData.adset_id,
                    campaign_id: attributionData.campaign_id
                },
                custom_data: {
                    currency: 'NGN',
                    value: 50000
                },
                original_event_data: {
                    event_name: 'Contact',
                    event_time: Math.floor(Date.now() / 1000)
                }
            };

            // Send to Meta Conversions API
            const response = await fetch('/api/meta-conversion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Contact form submission tracked successfully:', result);
                
                // Log to SheetDB for comprehensive tracking
                try {
                    const sheetLogData = {
                        event_name: 'Contact',
                        event_id: eventId,
                        event_time: Math.floor(Date.now() / 1000),
                        user_data: {
                            // Meta API format for hash values (what the sheet function expects)
                            em: [hashedEmail], // Email hash in Meta format
                            ph: [hashedPhone], // Phone hash in Meta format  
                            fn: [hashedFirstName], // First name hash in Meta format
                            // Original values for reference
                            email: formData.email,
                            phone: formData.phone,
                            name: formData.name,
                            // Additional hashed values for verification
                            email_hash: hashedEmail,
                            phone_hash: hashedPhone,
                            first_name_hash: hashedFirstName,
                            last_name_hash: hashedLastName,
                            client_ip_address: clientIp,
                            client_user_agent: browserData.userAgent,
                            fbp: browserData.fbp || '',
                            fbc: browserData.fbc || '',
                        },
                        custom_data: {
                            currency: 'NGN',
                            value: 50000,
                        },
                        event_source_url: window.location.href,
                        meta_response: result,
                        additional_data: { 
                            action: 'form_submission', 
                            form_location: 'contact_page',
                            form_data: formData
                        }
                    };
                    
                    // Debug logging for sheet data
                    console.log('📊 Sheet log data being sent:', sheetLogData);
                    
                    await fetch('/api/log-meta-event', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(sheetLogData),
                    });
                } catch (sheetError) {
                    console.warn('⚠️ Contact form sheet logging failed:', sheetError);
                }
                
                setSubmitStatus("success");
                // Don't clear formData immediately so we can use the name in the success message
                // We'll clear it after a delay
                setTimeout(() => {
                    setFormData({ name: "", email: "", phone: "", message: "" });
                }, 5000);
                
            } else {
                console.error('❌ Failed to send Contact form event:', response.status);
                throw new Error('Failed to submit form');
            }
            
        } catch (error) {
            console.error('❌ Failed to submit contact form:', error);
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

  const getClientIp = async (): Promise<string> => {
    try {
      // First try to get IPv6 address
      try {
        const ipv6Response = await fetch('https://api64.ipify.org?format=json');
        const ipv6Data = await ipv6Response.json();
        if (ipv6Data.ip && ipv6Data.ip.includes(':')) {
          console.log('🌐 Contact form using IPv6 address:', ipv6Data.ip);
          return ipv6Data.ip;
        }
      } catch (ipv6Error) {
        console.warn('Contact form IPv6 fetch failed, falling back to IPv4:', ipv6Error);
      }

      // Fallback to IPv4 if IPv6 is not available
      const ipv4Response = await fetch('https://api.ipify.org?format=json');
      const ipv4Data = await ipv4Response.json();
      console.log('🌐 Contact form using IPv4 address (IPv6 not available):', ipv4Data.ip);
      return ipv4Data.ip || '0.0.0.0'; 
    } catch (error) {
      console.warn('Could not get client IP:', error);
      return '0.0.0.0';
    }
  };

    return (
        <section className="bg-white text-black py-20">
            <div className=" md:px-2 lg:px-24">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Get in Touch
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Whether it's about curriculum, schedules, or payments, our team is here to help you secure your child's digital success.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {submitStatus === "success" ? (
                        /* Success State with WhatsApp CTA */
                        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                            <div className="mb-6">
                                <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-2xl font-bold text-green-800 mb-2">
                                    Thanks for reaching out{formData.name ? `, ${formData.name.split(' ')[0]}` : ''}!
                                </h3>
                                <p className="text-green-700 text-lg">
                                    We've received your message and will get back to you within 24 hours.
                                </p>
                            </div>
                            
                            {/* WhatsApp Call to Action */}
                            <div className="bg-white rounded-lg p-6 border border-green-300">
                                <h4 className="text-xl font-bold text-gray-900 mb-2">
                                    Need Answers NOW? Chat with us on WhatsApp!
                                </h4>
                                <p className="text-gray-600 mb-4">
                                    Click below to connect directly with our admissions team for instant support.
                                </p>
                                <a
                                    href="https://wa.me/2348081787841?text=Hi%2C%20I%20just%20submitted%20a%20contact%20form%20on%20your%20website%20and%20have%20a%20question%20about%20the%20Summer%20Program."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                                    </svg>
                                    Chat on WhatsApp Now!
                                </a>
                            </div>
                        </div>
                    ) : (
                        /* Contact Form */
                        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200">
                        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Send us a Message
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name and Email Row */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chambray-500 focus:border-transparent transition-colors"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chambray-500 focus:border-transparent transition-colors"
                                        placeholder="Enter your email address"
                                    />
                                </div>
                            </div>

                            {/* Phone Field */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chambray-500 focus:border-transparent transition-colors"
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            {/* Message Field */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chambray-500 focus:border-transparent transition-colors resize-none"
                                    placeholder="Tell us about your questions or how we can help..."
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 text-lg ${
                                    isSubmitting
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-chambray-600 hover:bg-chambray-700 active:bg-chambray-800"
                                }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Sending Your Question...
                                    </span>
                                ) : (
                                    "Send My Question"
                                )}
                            </button>

                            {submitStatus === "error" && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-red-800 font-medium">
                                            Something went wrong. Please try again or contact us directly.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                    )}
                </div>
            </div>
        </section>
    )
}