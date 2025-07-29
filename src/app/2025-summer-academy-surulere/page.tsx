import Footer from "@/components/Footer";
import Hero from "@/components/academy/summer/Hero";
import Problem from "@/components/academy/summer/Problem";
import Solution from "@/components/academy/summer/Solution";
import Offer from "@/components/academy/summer/Offer";
import Risk from "@/components/academy/summer/Risk";
import Enrollment from "@/components/academy/summer/Enrollment";
import FAQ from "@/components/academy/summer/FAQ";
import Contact from "@/components/academy/summer/Contact";

export default function Page() {
  return (
    <main className="text-white space-y-4">
      {/* Floating Urgency Bar */}
      <div className="fixed top-0 left-0 w-full text-white bg-red-500 text-center p-2 z-50 text-sm md:text-base !rounded-none">
        <span className="font-semibold uppercase tracking-wider">
          Offer Ends August 5th!
        </span>
        <span className="font-bold mx-2 hidden md:inline-block">|</span>
        <span className="hidden md:inline-block">
          LESS THAN 30 SLOTS LEFT (SURULERE)!
        </span>
      </div>

      <Hero />
      <Problem />
      <Solution />
      <Offer />
      <Risk />
      <div id="enrollment">
        <Enrollment />
      </div>
      <Contact />
      
      {/* Ensure FAQ is included after Contact */}
      <FAQ />
      <Footer />
    </main>
  );
} 