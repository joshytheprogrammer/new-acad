import Image from "next/image";
import Link from "next/link";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="bg-white rounded-2xl pt-12 pb-0 px-8 lg:px-20 mt-2 md:mt-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row flex-wrap md:justify-between gap-y-12 lg:gap-y-16 md:gap-x-0">
        {/* Logo and Description */}
        <div className="flex-1 min-w-fit mb-8 md:mb-0">
          <Image
            src="/images/logo.svg"
            alt="Walls & Gates Academy Logo"
            className="w-16 h-16 mb-2"
            width={64}
            height={64}
          />
          <h3 className="text-3xl font-bold">Walls & Gates Academy</h3>
          <p className="text-gray-600 text-sm mt-2 max-w-xs">
            Transforming young minds through practical digital skills education.
            Building the next generation of creative professionals.
          </p>
        </div>

        <div className="flex gap-0 flex-wrap md:flex-nowrap">
          {/* Quick Links */}
          <div className="flex-1 min-w-[160px] mb-8 md:mb-0">
            <h4 className="text-gray-900 mb-3 font-semibold">Academy</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <Link href="/" className="hover:text-chambray-700">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/2025-summer-academy-surulere" className="hover:text-chambray-700">
                  Summer Program
                </Link>
              </li>
              <li>
                <Link href="#programs" className="hover:text-chambray-700">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-chambray-700">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          {/* Resources */}
          <div className="flex-1 min-w-[160px] mb-8 md:mb-0">
            <h4 className="font-semibold text-gray-900 mb-3">Resources</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <a 
                  href="https://wandggroup.com" 
                  className="hover:text-chambray-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Main Website
                </a>
              </li>
              <li>
                <a 
                  href="https://wandggroup.com/blog" 
                  className="hover:text-chambray-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Blog & Insights
                </a>
              </li>
              <li>
                <a 
                  href="mailto:academy@wandggroup.com" 
                  className="hover:text-chambray-700"
                >
                  Contact Academy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex-1 min-w-fit">
          <h4 className="font-bold text-3xl text-gray-950 mb-3">
            Get In Touch
          </h4>
          <p className="text-gray-600 text-sm mb-3">
            Ready to join our academy? Contact us today!
          </p>
          <div className="space-y-2 text-gray-600 text-sm">
            <p>📧 academy@wandggroup.com</p>
            <p>📱 +234 808 178 7841</p>
            <p>📍 33, Adegoke Surulere, Lagos</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mt-10 py-12 border-t border-gray-200 text-gray-500 text-sm gap-4 !rounded-none">
        <div className="text-center">
          &copy; {new Date().getFullYear()} Walls & Gates Academy. All rights reserved.
        </div>
        <SocialLinks />
      </div>
    </footer>
  );
}

export function SmallerFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white rounded-2xl pt-8 px-8 lg:px-20 mt-2 lg:mt-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-y-4">
        {/* Logo */}
        <Image
          src="/images/logo.svg"
          alt="Walls & Gates Academy Logo"
          className="w-12 h-12"
          width={48}
          height={48}
        />

        {/* Links */}
        <div className="hidden md:flex space-x-6 text-gray-800 text-sm">
          <Link href="/" className="hover:text-chambray-700">
            Home
          </Link>
          <Link href="/2025-summer-academy-surulere" className="hover:text-chambray-700">
            Summer Program
          </Link>
          <Link href="#programs" className="hover:text-chambray-700">
            Programs
          </Link>
          <Link href="#contact" className="hover:text-chambray-700">
            Contact
          </Link>
        </div>

        {/* Social Links */}
        <SocialLinks />
      </div>
      <hr className=" my-4 md:my-6 border border-gray-300/80 h-px" />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center pb-8 text-gray-500 text-sm gap-4">
        <div>Walls&Gates Academy &copy; {currentYear}. All Rights Reserved</div>
      </div>
    </footer>
  );
} 