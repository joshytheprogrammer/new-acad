"use client";

import { Share2, Users, CheckCircle, DollarSign, Copy, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function Referal() {
  const [copied, setCopied] = useState(false);
  const referralLink = "wandgacademy.com/referral:82349654";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareToWhatsApp = () => {
    const message = `🎓 Know a Parent Who'd Love This? Get ₦5,000 for Every Friend You Refer!

I found this amazing Summer Tech Academy for kids and thought you'd be interested! 

Your child can learn:
🔸 Web Development 
🔸 Graphic Design
🔸 Build real projects
🔸 Win a brand new laptop!

Plus, I earn ₦5,000 for every successful referral (and you save ₦5,000 too!)

Check it out: ${referralLink}

Only 23 spots left - these disappear fast! 🏃‍♀️💨`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="relative py-20 px-4 lg:px-8 xl:px-24 bg-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 opacity-10">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#446ccc" strokeWidth="2" strokeDasharray="10,5"/>
        </svg>
      </div>
      <div className="absolute top-20 right-20 opacity-10">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <polygon points="40,10 70,70 10,70" fill="#5886d9"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-chambray-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Earn ₦5,000 Per Referral
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Know a Parent Who'd Love This?
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-chambray-600 mb-6">
            Get ₦5,000 for Every Friend You Refer!
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Earn ₦5,000 for every parent you refer who enrolls. It's our way of saying thank you for spreading the word.
          </p>
        </div>

        {/* How It Works Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Step 1 */}
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-8 text-center relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Share2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Share the Program</h3>
              <p className="text-gray-700 text-sm">
                Tell another parent about the summer tech camp — in person, on WhatsApp, or using your unique referral link.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl p-8 text-center relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">They Enroll and Pay</h3>
              <p className="text-gray-700 text-sm">
                Once your friend completes their child's registration and payment, we'll match it with your referral.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-8 text-center relative">
           <div className="pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get ₦5,000 Instantly</h3>
              <p className="text-gray-700 text-sm">
                You'll receive ₦5,000 cash for every confirmed referral. No limits.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            Send us a message to get started.
          </p>
          <a
                                    href="https://wa.link/vitexa"
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
    </section>
  );
}