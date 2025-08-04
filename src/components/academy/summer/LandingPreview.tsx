"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LandingPreview() {

    const [timeLeft, setTimeLeft] = useState({
                days: "00",
                hours: "00",
                minutes: "00",
                seconds: "00",
              });
            
              useEffect(() => {
                const timer = setInterval(() => {
                  const targetDate = new Date("2025-08-12T23:59:59");
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
    
    return(
        <section className="bg-sand-black text-white py-24 px-4 text-center">
        <h2 className="font-bebas text-4xl md:text-5xl lg:text-6xl font-bold">
          <span className="text-urgent-red leading-snug">WASTING ANOTHER SUMMER?</span>
          <br />
          LESS THAN 30 SLOTS LEFT (SURULERE)!
        </h2>
        <p className="font-satoshi text-lg md:text-xl mt-4 max-w-3xl mx-auto">
          Transform unproductive screen time into future-proof digital skills
          (Web Dev / Graphic Design) before August 12th. Secure your child&apos;s
          spot at our 33, Adegoke Surulere location!
        </p>
        <div className="mt-8">
          {/* Countdown Timer */}
          <div className="text-3xl md:text-4xl text-urgent-red">
            Offer Ends In: [{timeLeft.days} : {timeLeft.hours} : {timeLeft.minutes} : {timeLeft.seconds}]
          </div>
          <p className="font-satoshi text-lg text-urgent-red mt-2">
            LIMITED SPOTS REMAINING!
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/2025-summer-academy-surulere"
            className="inline-block bg-chambray-700 hover:bg-chambray-800 text-white font-bold py-4 px-8 rounded-lg text-xl"
          >
            SECURE YOUR SPOT NOW!
          </Link>
        </div>
      </section>
    )
}