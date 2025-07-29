export default function Offer() {
  return (
    <section className="bg-sand-black py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-bebas text-4xl md:text-5xl font-bold tracking-tight text-white">
            The <span className="text-chambray-600">Unbeatable Value</span>{" "}
            You&apos;re Getting This Summer
          </h2>
          <div className="mt-16 bg-black/20 rounded-lg shadow-lg p-8">
            <div className="divide-y !rounded-none divide-gray-700">
              {/* Value Stack Item */}
              <div className="py-6 flex flex-col md:flex-row items-center justify-between !rounded-none">
                <div className="text-left">
                  <h3 className="font-bebas text-2xl text-white">
                    Expert-Led Summer Camp
                  </h3>
                  <p className="mt-1 text-gray-400">
                    Web Dev or Graphic Design Track
                  </p>
                </div>
                <p className="font-satoshi text-xl font-bold text-chambray-600 mt-2 md:mt-0 !rounded-none">
                  Value: ₦150,000
                </p>
              </div>
              {/* Value Stack Item */}
              <div className="py-6 flex flex-col md:flex-row items-center justify-between !rounded-none">
                <div className="text-left">
                  <h3 className="font-bebas text-2xl text-white">
                    Bonus 1: Digital Portfolio Kit
                  </h3>
                  <p className="mt-1 text-gray-400">
                    Create a real project to showcase skills
                  </p>
                </div>
                <p className="font-satoshi text-xl font-bold text-chambray-600 mt-2 md:mt-0 !rounded-none">
                  Value: ₦30,000
                </p>
              </div>
              {/* Value Stack Item */}
              <div className="py-6 flex flex-col md:flex-row items-center justify-between !rounded-none">
                <div className="text-left">
                  <h3 className="font-bebas text-2xl text-white">
                    Bonus 2: Post-Camp Digital Courses
                  </h3>
                  <p className="mt-1 text-gray-400">
                    Lifetime access to advanced material
                  </p>
                </div>
                <p className="font-satoshi text-xl font-bold text-chambray-600 mt-2 md:mt-0 !rounded-none">
                  Value: ₦100,000
                </p>
              </div>
              {/* Value Stack Item */}
              <div className="py-6 flex flex-col md:flex-row items-center justify-between !rounded-none">
                <div className="text-left">
                  <h3 className="font-bebas text-2xl text-white">
                    Bonus 3: Future-Proof Parent Guide
                  </h3>
                  <p className="mt-1 text-gray-400">
                    Support your child&apos;s digital journey
                  </p>
                </div>
                <p className="font-satoshi text-xl font-bold text-chambray-600 mt-2 md:mt-0 !rounded-none">
                  Value: ₦15,000
                </p>
              </div>
            </div>
            {/* Total Value & Price Reveal */}
            <div className="mt-12 pt-8 border-t !rounded-none border-gray-700">
              <p className="font-bebas text-2xl text-red-400 line-through">
                Total Real-World Value: Over ₦300,000
              </p>
              <p className="font-bebas font-semibold text-5xl md:text-6xl text-chambray-600 mt-4">
                Yours for Just ₦50,000!
              </p>
            </div>
          </div>
          {/* Laptop Prize */}
          <div className="mt-12 flex flex-col lg:flex-row items-center justify-center gap-4 bg-black/20 p-4 rounded-lg">
            <svg
              className="w-10 h-10 text-chambray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
            <p className="font-bebas text-xl font-bold text-white">
              PLUS: The Most Improved Student Wins a Brand New LAPTOP!
            </p>
          </div>
        </div>
      </section>
  );
}
