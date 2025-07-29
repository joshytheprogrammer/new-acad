"use client";
import { MenuIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "../LinkButton";

const navLinks = [
  { href: "#programs", label: "Programs" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact Us" },
];

export default function AcademyNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <nav className="flex justify-between items-center p-3 bg-chambray-800 text-white  md:px-12 sticky top-4 z-40 mb-2 md:mb-4 max-w-7xl mx-auto rounded-full">
      <Link href="/" className="z-60" >
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={42}
          height={40}
          className="size-12 z-60 rounded-full"
        />
      </Link>

      {/* Desktop Nav Links */}
      <div className="hidden lg:flex items-center gap-9 ml-5 text-base font-medium text-white ">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={` ${
              pathname.startsWith(link.href) && link.href !== "/"
                ? "active-link"
                : pathname === "/" && link.href === "/"
                  ? "active-link"
                  : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Desktop Button */}
      <Button href="#contact" className="max-lg:hidden bg-white" variant="outlined">
        Enroll Now
      </Button>

      {/* Mobile Menu Button */}
      <button
        aria-label="Open menu"
        className="lg:hidden"
        onClick={() => setOpen(true)}
      >
        <MenuIcon className="size-8" />
      </button>

      {/* Mobile Fullscreen Centered Menu */}
      <div
        className={`
          fixed inset-0 z-50 bg-chambray-800 !rounded-none text-white flex items-center justify-center
          transition-opacity duration-300 ease-in-out lg:hidden
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* Close button in top-right */}
        <button
          aria-label="Close menu"
          className="absolute top-10 right-5 md:top-9 md:right-24"
          onClick={() => setOpen(false)}
        >
          <X className="size-8" />
        </button>

        {/* Centered links */}
        <div className="flex flex-col gap-8 text-2xl uppercase font-semibold text-white text-center">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={
                pathname.startsWith(link.href) && link.href !== "/"
                  ? "active-link"
                  : pathname === "/" && link.href === "/"
                    ? "active-link"
                    : ""
              }
            >
              {link.label}
            </a>
          ))}

          <Button
            className="text-2xl py-4 bg-white"
            variant="outlined"
            href="#contact"
            onClick={() => setOpen(false)}
          >
            Enroll Now
          </Button>
        </div>
      </div>
    </nav>
  );
} 