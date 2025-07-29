"use client";
import { usePathname } from "next/navigation";
import AcademySocialLinks from "./AcademySocialLinks";

export default function SocialLinks() {
  const pathname = usePathname();
  const isAcademyPage = pathname.startsWith("/academy");

  if (isAcademyPage) return <AcademySocialLinks />;

  // Default social links for non-academy pages
  return <AcademySocialLinks />;
} 