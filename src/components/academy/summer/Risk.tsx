import Image from "next/image";

export default function Risk() {
  return (
    <section className="py-16 px-4 lg:px-8 xl:px-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Your Future is Secured:{" "}
              <span className="text-red-500">Zero Risk.</span>{" "}
              <span className="text-purple-600">Massive Rewards.</span>
            </h2>
            
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              We know how important this decision is. That's why we've removed all the risk. If, after 10 days, you don't see real progress in your child's digital skills and confidence, we'll refund you in full. No stress. No hidden conditions.
            </p>
            
            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 text-lg font-medium">No questions asked</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 text-lg font-medium">Full refund within 10 days</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 text-lg font-medium">No risk, all reward</span>
              </div>
            </div>
          </div>
        <div className="w-full lg:w-1/2 flex justify-center">
          <Image
                src="/images/secure.png"
                alt="Shield with checkmark"
                width={500}
                height={500}
                className=""
              />
        </div>
        </div>
      </div>
    </section>
  );
}