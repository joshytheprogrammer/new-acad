"use client";
import LinkButton from "@/components/LinkButton";
import { useEffect, useState } from "react";

export default function Risk() {

    const [timeLeft, setTimeLeft] = useState({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      });
    
      useEffect(() => {
        const timer = setInterval(() => {
          const targetDate = new Date("2025-08-05T23:59:59");
          const now = new Date();
          const difference = targetDate.getTime() - now.getTime();
    
          const format = (num: number) => num.toString().padStart(2, "0");
    
          if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);
    
            setTimeLeft({
              days: format(days),
              hours: format(hours),
              minutes: format(minutes),
              seconds: format(seconds),
            });
          } else {
            setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
            clearInterval(timer);
          }
        }, 1000);
    
        return () => clearInterval(timer);
      }, []);


    return (
        <section className="bg-white py-24 px-4 text-center text-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-bebas text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Your Future is Secured:{" "}
            <span className="text-chambray-600">
              Zero Risk. Massive Rewards.
            </span>
          </h2>
          <div className="mt-12 bg-gradient-to-r from-chambray-50 to-blue-50 border-2 border-chambray-200 rounded-xl p-8 shadow-lg space-y-12">
            <div className=" flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
              <svg
                className="w-24 h-24 text-chambray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                ></path>
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-bebas text-3xl font-bold leading-snug text-center lg:text-left text-gray-900">
                Our 10-Day Digital Confidence Guarantee
              </h3>
              <p className="mt-2 text-gray-700 text-lg text-center lg:text-left">
                If, after the first 10 days of the program, you don&apos;t see
                tangible progress in your child&apos;s skills and a noticeable
                boost in their digital confidence, we&apos;ll give you a full
                refund. No questions asked. The risk is entirely on us.
              </p>
            </div>
            </div>
            <div>
              <h3 className="font-bebas text-4xl md:text-5xl font-bold text-gray-900 uppercase">
                Don&apos;t Wait.{" "}
                <span className="text-red-500 block mt-6">Tomorrow May Be Too Late!</span>
              </h3>
              <div className="mt-6 flex items-center justify-center gap-4 md:gap-8">
                <div className="text-center">
                  <p className="font-bebas text-5xl md:text-7xl text-red-500 font-bold">
                    {timeLeft.days}
                  </p>
                  <p className="text-sm uppercase tracking-wider text-gray-700">Days</p>
                </div>
                <div className="text-center">
                  <p className="font-bebas text-5xl md:text-7xl text-red-500 font-bold">
                    {timeLeft.days}
                  </p>
                  <p className="text-sm uppercase tracking-wider text-gray-700">Hours</p>
                </div>
                <div className="text-center">
                  <p className="font-bebas text-5xl md:text-7xl text-red-500 font-bold">
                    {timeLeft.minutes}
                  </p>
                  <p className="text-sm uppercase tracking-wider text-gray-700">Mins</p>
                </div>
                <div className="text-center">
                  <p className="font-bebas text-5xl md:text-7xl text-red-500 font-bold">
                    {timeLeft.seconds}
                  </p>
                  <p className="text-sm uppercase tracking-wider text-gray-700">Secs</p>
                </div>
            </div>
            <p className="mt-4 text-xl font-semibold text-gray-800">
              ONLY <span className="text-red-500 font-bold">23 SLOTS</span> LEFT
              (SURULERE)! THESE SPOTS DISAPPEAR FAST!
            </p>
            
            {/* CTA to scroll to enrollment */}
            <div className="mt-8">
              <LinkButton href="#enrollment">
                SECURE YOUR SPOT NOW!
              </LinkButton>
            </div>
            </div>
          </div>
        </div>
      </section>
    )
}