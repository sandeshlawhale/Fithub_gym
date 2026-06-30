import Link from "next/link";
import { MapPin } from "lucide-react";
import Logo from "./Logo";

interface FooterProps {
  isLoggedIn?: boolean;
}

const FooterLinks = [
  { label: "About Us", href: "/about" },
  { label: "Memberships", href: "/memberships" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/#contact" },
]

export default function Footer({ isLoggedIn }: FooterProps) {
  return (
    <footer className="bg-surface-container dark:bg-surface-container w-full border-t border-outline-variant py-16 px-4 md:px-container-margin">
      <div className="max-w-7xl md:px-container-margin mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 md:items-center">
        <div className="col-span-1 md:col-span-2 flex flex-col gap-md md:pr-xl">
          <div className="flex items-center gap-md">
            <div className="flex items-center gap-md">
              <Logo />
              <div className="h-6 w-px bg-primary block" />
            </div>
            <div className="flex gap-md">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/thefithubgym.narkhed"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E1306C] hover:opacity-80 transition-opacity flex items-center gap-xs text-xs"
                title="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 shrink-0"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/918788849529"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] hover:opacity-80 transition-opacity flex items-center gap-xs text-xs"
                title="WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                  className="w-6 h-6 shrink-0"
                >
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
              </a>

              {/* Google Maps */}
              <a
                href="https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUqCAgAEEUYJxg7MggIABBFGCcYOzIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIHCAgQABiABDIHCAkQABiABNIBCTEwNTM0ajBqN6gCALACAA&um=1&ie=UTF8&fb=1&gl=in&sa=X&geocode=KY-RnQyGrdU7MaHJY1UE-nxj&daddr=Plot+no+6456,+Ward+no+17,+opp+Govt+ITI,+Kalambha+Road,+Narkhed+-+441304"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4285F4] hover:opacity-80 transition-opacity flex items-center gap-xs text-xs"
                title="Google Maps"
              >
                <MapPin className="w-6 h-6 shrink-0" />
              </a>
            </div>
          </div>

          <p className="text-on-surface-variant">
            Your trusted fitness destination in Narkhed, offering modern equipment, flexible memberships, and a supportive training environment.
          </p>
        </div>

        <div className="col-span-1 md:col-span-3 flex justify-end items-center w-full h-fit flex-wrap sm:flex-nowrap gap-xl">
          {FooterLinks.map((link) => (
            <Link
              key={link.href}
              className="text-on-surface-variant hover:text-primary transition-colors text-sm"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-6 w-px bg-outline block" />
          {isLoggedIn ? (
            <Link className="transition-colors text-sm font-semibold text-primary" href="/admin/dashboard">Dashboard</Link>
          ) : (
            <Link className="transition-colors text-sm font-semibold text-primary" href="/auth/login">Login</Link>
          )}
        </div>
      </div>

      {/* Below footer: copyright (left) and legal links (right) */}
      <div className="max-w-7xl md:px-container-margin mx-auto border-t border-outline-variant/20 mt-xl pt-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-md text-xs text-on-surface-variant">
        <div className="flex flex-col gap-xs">
          <div className="text-on-surface-variant/70">
            © {new Date().getFullYear()} The FitHub Gym by Millenial Corp LLP. <br />All rights reserved.
          </div>
        </div>
        <div className="flex gap-lg justify-end">
          <Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
          <Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
