import {
  Laptop,
  BookOpen,
  CodeXml,
  Sun,
  GraduationCap,
  PartyPopper,
} from "lucide-react";
import LinkButton from "@/components/LinkButton";


export default function Hero(){
  return (
     <section
        className="relative flex items-center justify-center text-center p-4 py-32 bg-white overflow-hidden"
      >
        {/* Decorative Icons */}
        <Laptop className="absolute top-20 -left-4 w-32 h-32 text-blue-200 opacity-80 -rotate-12 z-0" />
        <BookOpen className="hidden md:block absolute top-10 right-1/4 w-20 h-20 text-pink-200 opacity-60 rotate-6 z-0" />
        <CodeXml className="absolute bottom-12 -right-8 w-36 h-36 text-purple-200 opacity-80 rotate-12 z-0" />
        <Sun className="hidden md:block absolute bottom-10 left-1/4 w-16 h-16 text-yellow-200 opacity-70 z-0" />
        <GraduationCap className="hidden lg:block absolute top-24 left-[15%] w-24 h-24 text-green-200 opacity-70 -rotate-6 z-0" />
        <PartyPopper className="hidden lg:block absolute bottom-20 right-[20%] w-16 h-16 text-red-200 opacity-60 rotate-3 z-0" />
        <div className="relative z-10 max-w-4xl">
          <h1 className="font-bebas text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-black">
            <span className="text-urgent-red">
              Stop Wasting Another Summer!!!
            </span>
            <br />
            <span className="text-gray-700">
              Transform Your Child&apos;s Screen Time Into Skill Time Before
              August 5th!
            </span>
          </h1>
          <p className="font-satoshi text-lg md:text-xl text-gray-600 mt-6">
            Exclusive Program for Ages 10-18 at{" "}
            <span className="text-chambray-700 font-bold">
              33, Adegoke, Surulere
            </span>{" "}
            –{" "}
            <span className="font-bold">
              LESS THAN 30 SLOTS LEFT!
            </span>
          </p>
          <LinkButton href="#enrollment" className="mt-8">
            Secure Your Spot Today!
          </LinkButton>
        </div>
      </section>
  );
};