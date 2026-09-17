import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "@/components/icons/SocialIcons";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Trekking Adventures", href: "/packages?category=trekking" },
      { label: "Temple Yatras", href: "/packages?category=spiritual" },
      { label: "One Day Trips", href: "/packages?category=oneday" },
      { label: "Weekend Escapes", href: "/packages?category=weekend" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQs", href: "/faq" },
      { label: "Cancellation Policy", href: "/policy/cancellation" },
      { label: "Terms & Conditions", href: "/policy/terms" },
      { label: "Privacy Policy", href: "/policy/privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-surface-muted">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/btt_logo_icon.png" alt="" width={40} height={57} className="h-9 w-auto" />
              <Image
                src="/btt_label_trimmed.png"
                alt="Bharath Treks & Tales"
                width={597}
                height={146}
                className="h-11 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm opacity-70">
              Cinematic treks, spiritual pilgrimages and one day adventures across India.
              Every journey, told well.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[InstagramIcon, FacebookIcon, YoutubeIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 transition-colors hover:bg-royal hover:text-white hover:border-royal"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-heading text-sm font-semibold uppercase tracking-wide">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm opacity-70 transition-opacity hover:opacity-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wide">
              Reach Us
            </h4>
            <ul className="mt-4 space-y-3 text-sm opacity-70">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0" />
                <span>
                  The Executive Zone, Shakti Tower-1, No.766
                  <br />
                  Anna Salai, Mount Road, Chennai - 600002
                </span>
              </li>
              <li className="flex flex-col gap-1.5">
                <a href="tel:+919944048889" className="flex items-center gap-2 transition-opacity hover:opacity-100">
                  <Phone size={15} className="shrink-0" /> +91 99440 48889
                </a>
                <a href="tel:+918807750608" className="flex items-center gap-2 transition-opacity hover:opacity-100">
                  <Phone size={15} className="shrink-0" /> +91 88077 50608
                </a>
              </li>
              <li className="flex flex-col gap-1.5">
                <a
                  href="mailto:support@bharathtreksandtales.com"
                  className="flex items-center gap-2 transition-opacity hover:opacity-100"
                >
                  <Mail size={15} className="shrink-0" /> support@bharathtreksandtales.com
                </a>
                <a
                  href="mailto:bharathtreksandtales@gmail.com"
                  className="flex items-center gap-2 transition-opacity hover:opacity-100"
                >
                  <Mail size={15} className="shrink-0" /> bharathtreksandtales@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-foreground/10 pt-6 text-xs opacity-60 sm:flex-row">
          <p>© {new Date().getFullYear()} Bharath Treks & Tales. All rights reserved.</p>
          <p>Made with 🧡 for the wanderers of India.</p>
        </div>
      </div>
    </footer>
  );
}
