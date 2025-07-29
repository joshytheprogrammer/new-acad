import Consultation from "@/components/Consultation";
import Footer from "@/components/Footer";
import AboutContact from "@/components/academy/AboutContact";
import AcademyHero from "@/components/academy/AcademyHero";
import AcademyNav from "@/components/academy/AcademyNav";
import Courses from "@/components/academy/Courses";
import Offerings from "@/components/academy/Offerings";
import OurProofs from "@/components/academy/OurProofs";
import OurReasons from "@/components/academy/OurReasons";
import StepsToPro from "@/components/academy/StepsToPro";
import LandingPreview from "@/components/academy/summer/LandingPreview";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Academy | Walls & Gates Nigeria",
  description:
    "Join Walls & Gates Academy — gain in-demand creative skills, hands-on experience, and personalized mentorship to elevate your career in the creative industry.",
  alternates: { canonical: "https://academy.wandgroup.com/" },
  openGraph: {
    title: "Academy | Walls & Gates Nigeria",
    description:
      "Join Walls & Gates Academy — gain in-demand creative skills, hands-on experience, and personalized mentorship to elevate your career.",
    url: "https://academy.wandgroup.com/",
    siteName: "Walls & Gates Academy",
    images: [
      {
        url: "https://academy.wandgroup.com/images/about-hero.webp",
        width: 1200,
        height: 630,
        alt: "Walls & Gates Academy Hero",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Academy | Walls & Gates Nigeria",
    description:
      "Join Walls & Gates Academy — gain in-demand creative skills, hands-on experience, and personalized mentorship.",
    images: ["https://academy.wandgroup.com/images/about-hero.webp"],
  },
};

export default function AcademyLandingPage() {
  return (
    <div className="space-y-2 md:space-y-4">
      <AcademyNav />
      <AcademyHero />
      <LandingPreview />
      <OurReasons />
      <Offerings />
      <Courses />
      <OurProofs />
      <StepsToPro />
      <AboutContact />
      <Consultation
        title="Ready to Start Your Creative Journey"
        btnText="Apply Now"
      >
        Don't just watch others build. Join the creatives shaping the next big
        ideas.
      </Consultation>
      <Footer />
    </div>
  );
}
