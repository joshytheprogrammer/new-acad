import Image from 'next/image'
import React from 'react'
import { CheckCircle, CompassIcon, GraduationCap, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StepsToPro() {
  return (
    <section className="bg-white text-xl md:text-3xl p-6 md:p-12 lg:p-20 lg:px-12 max-lg:py-12 space-y-16">
      <div className="">
          <h2 className="text-3xl lg:text-4xl font-bold text-left md:text-center">Built for the Brave. Designed for Doers.</h2>
          <p className="text-lg text-gray-500 text-left md:text-center mt-4">Whether you want to master design, dominate digital marketing, or write words that move millions, we've got a seat for you</p>
      </div>
      <div>
        <div className="flex flex-col md:flex-row gap-4 items-stretch">        
            {/* Timeline section */}
          <div className="md:w-5/12">
            <ProgramTimeline />
          </div>
          {/* Image container - fixed for mobile */}
          <div className="flex-1 h-[300px] sm:h-[400px] md:h-auto">
            <div className="relative w-full h-full rounded-2xl overflow-hidden max-md:h-[400px]">
              <Image
                src="/images/two-women-looking-at-laptop.webp"
                alt="Contact"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

interface TimelineStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const ProgramTimeline: React.FC = () => {
  const steps: TimelineStep[] = [
    {
      title: "Choose Your Program",
      description: "Browse our variety of industry-relevant courses — from design and branding to digital marketing and audiovisual production — and select the one that fits your goals.",
      icon: <CompassIcon className="size-5" />,
      bgColor: "bg-red-100",
      textColor: "text-red-500",
    },
    {
      title: "Apply & Enroll",
      description: "Complete a short application, tell us about your goals, and reserve your spot in the next cohort. Our team will guide you through the simple enrollment process.",
      icon: <CheckCircle className="w-5 h-5" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-500",
    },
    {
      title: "Learn from Experts",
      description: "Join hands-on sessions led by seasoned professionals, work on real-life projects, collaborate with peers, and access materials both online and in person.",
      icon: <GraduationCap className="w-5 h-5" />,
      bgColor: "bg-green-100",
      textColor: "text-green-500",
    },
    {
      title: "Build, Graduate, & Grow",
      description: "Complete your training with a portfolio-ready project, earn your certification, and get career support to help you secure your dream job or advance in your career.",
      icon: <Rocket className="w-5 h-5" />,
      bgColor: "bg-orange-100",
      textColor: "text-orange-500",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 max-md:px-0">
      <div className="relative">
        {/* Single continuous timeline line */}
        <div className="absolute left-5 top-8 bottom-0 w-px bg-gray-3*00 border border-l border-dashed border-gray-300 -translate-x-1/2 "></div>
        
        {steps.map((step, index) => (
          <div key={index} className="mb-12 last:mb-0">
            <div className="flex">
              <div className="relative flex flex-col items-center mr-4">
                {/* Icon with colored background */}
                <div className={cn(
                  "flex bg-gray-50 items-center justify-center z-10 aspect-square size-10 rounded-full",
                  step.textColor
                )}>
                  {step.icon}
                </div>
              </div>
              <div className="pt-1">
                <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-lg">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 