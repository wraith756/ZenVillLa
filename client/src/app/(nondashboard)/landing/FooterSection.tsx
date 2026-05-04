import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

/* ---------------- Data ---------------- */

const FOOTER_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

const SOCIAL_LINKS = [
  { icon: faFacebook, label: "Facebook", href: "#" },
  { icon: faInstagram, label: "Instagram", href: "#" },
  { icon: faTwitter, label: "Twitter", href: "#" },
  { icon: faLinkedin, label: "LinkedIn", href: "#" },
  { icon: faYoutube, label: "YouTube", href: "#" },
];

/* ---------------- Component ---------------- */

const FooterSection = () => {
  return (
    <footer className="border-t border-gray-200 py-20">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        {/* Top Section */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand */}
          <Link
            href="/"
            scroll={false}
            className="text-xl font-bold tracking-tight"
          >
            ZENvilla
          </Link>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-6">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-700 hover:text-gray-900 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social Icons */}
          <div className="flex gap-4">
            {SOCIAL_LINKS.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition hover:text-[#57575f]"
              >
                <FontAwesomeIcon icon={icon} className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 text-center text-sm text-gray-500 md:flex-row">
          <span>
            © {new Date().getFullYear()} ZENvilla. All rights reserved.
          </span>

          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-700">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-700">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-gray-700">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
