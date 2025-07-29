import { ArrowRightIcon } from "lucide-react";
import Button from "../LinkButton";

export default function AcademyHero() {
  return (
    <section className="bg-linear-to-b from-white to-chambray-200 mt-4 flex flex-col space-y-12 xl:space-y-20 pb-2 lg:pb-4 px-2 lg:px-4">
      <div className="flex flex-col items-center justify-center space-y-8 text-center px-4 lg:px-0">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mt-12 md:mt-[100px]">
          Transform Your Skills. Elevate Your Future
        </h1>
        <p className="text-lg md:text-xl font-light md:max-w-2xl lg:max-w-4xl mx-auto">
          Gain in-demand skills through expert-led training, hands-on
          experience, and personalized mentorship to help you thrive in today's
          creative industry.
        </p>
        <div className="flex flex-wrap gap-2 lg:gap-4 max-md:w-full md:justify-start justify-around">
          <Button href="#programs">
            Explore Programs
            <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover/linkbtn:translate-x-0.5" />
          </Button>
          <Button variant="outlined" href="#contact">
            Apply Now
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Add academy hero image here if needed */}
      </div>
    </section>
  );
} 