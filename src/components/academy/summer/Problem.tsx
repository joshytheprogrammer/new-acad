import { BriefcaseIcon, Briefcase, HourglassIcon, SmartphoneIcon, } from "lucide-react";
import Image from "next/image";

export default function Problem() {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-24 text-black ">
      <div className="flex gap-8 flex-col lg:flex-row">
        <div className="w-full lg:w-1/2">
            <Image
            src="/images/bored.jpg"
            alt="Child looking bored at a screen"
            width={500}
            height={500}
            className="object-cover h-full w-full rounded-2xl"
          />
        </div>
        {/* Right: Content Card */}
        <div className=" rounded-2xl bg-white p-8 flex flex-col justify-center">
          <h2 className="font-bebas text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-snug mb-8">
            <span className="text-neutral-700">While Others Are Building...</span>
            <br />
            <span className="text-[#e4572e] text-3xl md:text-4xl lg:text-5xl font-bold">Is Your Child Being Left Behind?</span>
          </h2>
          <div className="flex flex-col gap-4">
            {/* Card 1 */}
            <div className="rounded-xl bg-[#e6e6fa] p-5 flex flex-col relative overflow-hidden">
              <div className="flex-shrink-0 w-10 h-10 /70 rounded-full flex items-center justify-center text-[#7c5dfa] text-2xl">
                <SmartphoneIcon />
              </div>
              <div>
                <div className="font-bold text-lg text-[#2d2d2d]">Unproductive Screen Time</div>
                <div className="text-sm text-[#444]">Nigerian teens spend over 7 hours online daily - mostly on entertainment, not education.</div>
              </div>
              <div className="absolute right-0 top-0 h-full w-24 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 100"><ellipse cx="80" cy="50" rx="30" ry="40" fill="#bcbcf7" fillOpacity="0.5" /></svg>
              </div>
            </div>
            {/* Card 2 */}
            <div className="rounded-xl bg-[#7c5dfa] p-5 flex flex-col relative overflow-hidden">
              <div className="flex-shrink-0 w-10 h-10 /70 rounded-full flex items-center justify-center text-[#e6e6fa] text-2xl">
                <HourglassIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-lg text-white">Lost Opportunities</div>
                <div className="text-white/90">Every day spent scrolling is a day opportunities for growth and learning are lost. Nigerian teens spend over 7 hours online daily.</div>
              </div>
              <div className="absolute right-0 top-0 h-full w-24 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 100"><circle cx="80" cy="50" r="30" fill="#bcbcf7" fillOpacity="0.2" /><circle cx="60" cy="80" r="10" fill="#bcbcf7" fillOpacity="0.3" /></svg>
              </div>
            </div>
            {/* Card 3 */}
            <div className="rounded-xl bg-[#ffe066] p-5 flex flex-col relative overflow-hidden">
              <div className="flex-shrink-0 w-10 h-10 /70 rounded-full flex items-center justify-center text-[#e1b000] text-2xl">
                <BriefcaseIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-lg text-[#2d2d2d]">The Digital Skills Gap</div>
                <div className=" text-[#444]">85% of jobs by 2030 will require digital skills. Is your child prepared for this digital revolution?</div>
              </div>
              <div className="absolute right-0 top-0 h-full w-24 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 100"><ellipse cx="80" cy="50" rx="30" ry="40" fill="#ffe066" fillOpacity="0.4" /><circle cx="60" cy="80" r="10" fill="#fffde0" fillOpacity="0.5" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}