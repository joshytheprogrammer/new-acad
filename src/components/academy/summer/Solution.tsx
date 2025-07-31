import Image from "next/image";

export default function Solution() {
  return (
    <section className="relative bg-sand-black text-white py-24 px-4 text-center overflow-hidden">
      {/* Decorative SVGs */}
      <div className="absolute left-0 top-0 z-0">
        <svg width="120" height="120" viewBox="0 0 120 120"><path d="M0,40 Q60,0 120,40" stroke="#fff" strokeWidth="2" fill="none" opacity="0.12"/></svg>
      </div>
      <div className="absolute right-8 top-4 z-0">
        <svg width="60" height="60" viewBox="0 0 60 60"><g stroke="#ffe066" strokeWidth="2" fill="none"><path d="M10 10l10 10"/><path d="M20 10l-10 10"/><circle cx="30" cy="30" r="8"/></g></svg>
      </div>
      <div className="absolute left-0 bottom-0 z-0">
        <svg width="80" height="80" viewBox="0 0 80 80"><polygon points="0,80 40,40 80,80" fill="#ffe066" opacity="0.18"/></svg>
      </div>
      <div className="absolute right-0 top-1/2 z-0">
        <svg width="100" height="100" viewBox="0 0 100 100"><g><path d="M90 10 Q100 50 60 90" stroke="#ffb3c6" strokeWidth="6" fill="none"/></g></svg>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="font-bebas text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">
          Your Child's Digital Future Starts This Summer
        </h2>
        <p className="mt-2 text-lg text-white/80 max-w-3xl mx-auto">
          At Walls and Gates Academy, we transform unproductive screen time into powerful, future-proof skills. We are your trusted guide on this journey.
        </p>
        <div className="mt-14 grid md:grid-cols-2 gap-8 text-left">
          {/* Web Dev Card */}
          <div className="bg-chambray-500 rounded-2xl p-8 flex flex-col items-start relative min-h-[420px]">
            {/* Scalloped Icon */}
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg" style={{clipPath:'polygon(50% 0%, 93% 12%, 100% 50%, 93% 88%, 50% 100%, 7% 88%, 0% 50%, 7% 12%)'}}>
              <svg width="32" height="32" fill="none" stroke="#7c5dfa" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><rect x="9" y="7" width="6" height="10" rx="2" /></svg>
            </div>
            <h3 className="font-bebas text-2xl md:text-3xl font-bold text-white mb-2">Web Development Track</h3>
            <p className="text-white/90 mb-6">Your child will learn to build websites and web applications from scratch, mastering the fundamentals of HTML, CSS, and JavaScript.</p>
            {/* White Rectangle */}
            <div className="bg-white rounded-lg h-24 w-full mb-6"></div>
            {/* Tech Icons */}
            <div className="flex justify-center gap-6 mt-auto w-full">
              <span className="inline-block">
                <Image src="/images/html.png" alt="HTML" width={32} height={32} className="w-8 h-8" />
              </span>
              <span className="inline-block">
                <Image src="/images/css.png" alt="CSS" width={32} height={32} className="w-8 h-8" />
              </span>
              <span className="inline-block">
                <Image src="/images/javascript.png" alt="JavaScript" width={32} height={32} className="w-8 h-8" />
              </span>
            </div>
          </div>
          {/* Graphic Design Card */}
          <div className="bg-yellow-500 rounded-2xl p-8 flex flex-col items-start relative min-h-[420px]">
            {/* Scalloped Icon */}
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg" style={{clipPath:'polygon(50% 0%, 93% 12%, 100% 50%, 93% 88%, 50% 100%, 7% 88%, 0% 50%, 7% 12%)'}}>
              <svg width="32" height="32" fill="none" stroke="#7c5dfa" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><rect x="9" y="7" width="6" height="10" rx="2" /></svg>
            </div>
            <h3 className="font-bebas text-2xl md:text-3xl font-bold text-[#2d2d2d] mb-2">Graphic Design Track</h3>
            <p className="text-[#2d2d2d]/90 mb-6">Your child will explore the principles of design, learning to create stunning visuals with industry-standard tools like Adobe Photoshop and Illustrator.</p>
            {/* White Rectangle */}
            <div className="bg-white rounded-lg h-24 w-full mb-6"></div>
            {/* Tool Icons */}
            <div className="flex justify-center gap-6 w-full mt-auto">
              <span className="inline-block">
                <Image src="/images/photoshop.png" alt="Photoshop" width={32} height={32} className="w-8 h-8" />
              </span>
              <span className="inline-block">
                <Image src="/images/illustator.png" alt="Illustrator" width={32} height={32} className="w-8 h-8" />
              </span>
              <span className="inline-block">
                <Image src="/images/xd.png" alt="XD" width={32} height={32} className="w-8 h-8" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}