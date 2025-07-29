import Image from "next/image";
import AcademyContactForm from "./AcademyContactForm";

export default function AboutContact() {
  return (
    <>
      <section className="bg-background" id="contact">
        <div className="flex flex-col-reverse lg:flex-row gap-4 items-stretch">
          {/* Image container - fixed for mobile */}
          <div className="flex-1 h-[300px] sm:h-[400px] lg:h-auto">
            <div className="relative w-full h-full rounded-2xl overflow-hidden max-lg:h-[400px]">
              <Image
                src="/images/two-guys-looking-at-laptop.webp"
                alt="Contact"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          {/* Form container remains the same */}
          <div
            id="contactform"
            className="bg-[#181818] py-8 md:py-10 lg:py-12 rounded-2xl flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-10"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-10 text-white">
              Get In Touch
            </h2>
            <AcademyContactForm />
          </div>
        </div>
      </section>
    </>
  );
} 