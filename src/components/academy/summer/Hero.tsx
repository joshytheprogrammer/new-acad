"use client";

import {
  Laptop,
  BookOpen,
  CodeXml,
  Sun,
  GraduationCap,
  PartyPopper,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero(){
  const [timeLeft, setTimeLeft] = useState({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
  
        const scrollToEnrollment = () => {
          const enrollmentSection = document.getElementById('enrollment');
          if (enrollmentSection) {
            enrollmentSection.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        };
      
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
     <section
        className="relative flex items-center justify-center text-center p-4 py-32 bg-white overflow-hidden"
      >
        <Image src="/images/paint.png" alt="Decorative Cap" width={100} height={100} className="absolute top-8 left-100 w-32 h-32 -rotate-12 z-0 opacity-50" />
        <Image src="/images/cap.png" alt="Decorative Cap" width={100} height={100} className="absolute top-20 right-28 w-32 h-32 -rotate-12 z-0 opacity-50" />
        <Image src="/images/laptop.png" alt="Decorative Laptop" width={100} height={100} className="absolute top-80 left-24 w-32 h-32 rotate-12 z-0 opacity-50" />
        <Image src="/images/chat.png" alt="Decorative Book" width={100} height={100} className="absolute top-100 right-1/4 w-20 h-20 rotate-6 z-0 opacity-50" />
        <div className="relative z-10 max-w-4xl space-y-8">
          <h1 className="font-bebas text-4xl md:text-6xl lg:text-7xl font-bold text-chambray-800">
              Don't Waste Another Summer!!!
          </h1>

          <div className="text-black lg:text-xl">
              Transform Your Child&apos;s Screen Time Into Skill Time Before
              August 5th!
          </div>
          <div>
            <button 
            onClick={scrollToEnrollment}
            className="inline-block bg-chambray-700 hover:bg-chambray-800 text-white py-4 px-8 text-xl transition-colors duration-300 rounded-full font-semibold"
          >
            Secure Your Child's Spot Today!
          </button>

          <div className="text-black mt-4 text-lg">Takes Less Than 2 Minutes to Register</div>
          </div>

               <div className="space-y-4 mt-12">
              <div className="mt-6 flex items-center justify-center gap-4 md:gap-8">
                {/* Simple black bg, white text timer */}
                {[
                  { label: "DAYS", value: timeLeft.days },
                  { label: "HOURS", value: timeLeft.hours },
                  { label: "MINUTES", value: timeLeft.minutes },
                  { label: "SECONDS", value: timeLeft.seconds },
                ].map((unit) => (
                  <div key={unit.label} className="flex flex-col items-center">
                    <div className="w-20 h-24 md:w-24 md:h-28 bg-black rounded-2xl shadow-lg flex items-center justify-center select-none">
                      <span className="font-bebas text-5xl md:text-7xl text-white font-extrabold tracking-tighter">
                        {unit.value}
                      </span>
                    </div>
                    <span className="mt-2 text-xs md:text-sm uppercase tracking-wider text-neutral-800 font-semibold">{unit.label}</span>
                  </div>
                ))}
              </div>
            <p className="font-semibold bg-neutral-900 rounded-full py-3 px-4 flex items-center justify-center gap-4 max-w-xl mx-auto text-white">
              <Image src="/images/warning.svg" alt="Limited Slots" width={18} height={18} className="inline-block" />
              <span>ONLY 23 SLOTS LEFT (SURULERE) <span className="hidden lg:inline">- THESE SPOTS DISAPPEAR FAST!</span></span>
            </p>
          </div>
          </div>
      </section>
  );
};