"use client";

import EnhancedEnrollmentForm from "./EnhancedEnrollmentForm";

interface PaystackReference {
  message: string;
  reference: string;
  status: "success" | "failure";
  trans: string;
  transaction: string;
  trxref: string;
}


export default function Enrollment() {

           const handlePaystackSuccess = async (reference: PaystackReference) => {
    // Payment success is now handled by the webhook
    console.log('Payment completed:', reference);
    
  };

  const handlePaystackClose = () => {
    console.log("Payment popup closed");
  };
    
    return (
        <section className="bg-gradient-to-br from-chambray-800 to-chambray-700 py-20 px-4 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform rotate-12 scale-150"></div>
                </div>
                
                <div className="relative z-10 px-2 md:px-4 lg:px-20" id="enrollment">
                  {/* Section Header */}
                  <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center bg-urgent-red/20 rounded-full px-6 py-2 mb-6">
                      <span className="text-urgent-red font-bold text-sm uppercase tracking-wider">
                        🔥 Limited Time Offer
                      </span>
                    </div>
                    
                    <h2 className="font-bebas text-4xl md:text-6xl font-bold text-white leading-tight">
                      <span className="block">SECURE YOUR CHILD'S</span>
                      <span className="block text-urgent-red">DIGITAL FUTURE NOW!</span>
                    </h2>
                    
                    <p className="mt-6 text-xl md:text-2xl text-chambray-100 max-w-2xl mx-auto">
                      Less than <span className="font-bold text-white">30 slots available</span> for this 
                      exclusive summer program. Don't let your child miss out!
                    </p>
                  </div>
        
                  {/* Enrollment Form Container */}
                  <div className="grid lg:grid-cols-2 gap-12 items-stretch">

                    

                    <div className="flex">
                      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 w-full flex flex-col">
                        <div className="text-center mb-8">
                          <div className="inline-flex items-center justify-center bg-chambray-100 rounded-full p-3 mb-4">
                            <svg className="w-8 h-8 text-chambray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                          </div>
                          <h3 className="font-bebas text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Secure Your Child's Spot
                          </h3>
                          <p className="text-gray-600">
                            Enter your details to complete enrollment
                          </p>
                        </div>
        
                        {/* Enhanced Enrollment Form */}
                        <div className="flex-grow" >
                          <EnhancedEnrollmentForm
                          onSuccess={handlePaystackSuccess}
                          onClose={handlePaystackClose}
                          />
                        </div>
                        
                        {/* Trust Signals */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-chambray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                              </svg>
                              <span>Secure Payment</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              <span>Money Back Guarantee</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-8 py-12 border border-white/20 w-full flex flex-col">
                        <h3 className="font-bebas text-2xl md:text-3xl font-bold text-white mb-6">
                          What You Get Today:
                        </h3>
                        
                        <div className="space-y-4 flex-grow">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-chambray-500 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-lg">Complete Training Program</h4>
                              <p className="text-chambray-200">Web Development or Graphic Design track</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-chambray-500 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-lg">Digital Portfolio</h4>
                              <p className="text-chambray-200">Professional projects to showcase skills</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-chambray-500 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-lg">Lifetime Course Access</h4>
                              <p className="text-chambray-200">Continue learning after the program</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-chambray-500 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-lg">"Future-Proof Parent" Guide!</h4>
                              <p className="text-chambray-200">Exclusive resources to help you support your child's digital journey</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-chambray-500 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-lg">Digital Confidence Guarantee!</h4>
                              <p className="text-chambray-200">Full refund if no tangible progress in 10 days. Zero risk!</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-yellow-400 text-lg">BONUS: Laptop Prize!</h4>
                              <p className="text-chambray-200">Most improved student wins a new laptop</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-white/20">
                          <div className="flex items-center justify-between">
                            <span className="text-chambray-200 line-through text-lg">₦300,000 Value</span>
                            <span className="font-bebas text-3xl md:text-4xl font-bold text-white">Only ₦50,000</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
    )
}