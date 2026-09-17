"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Trips", href: "/packages" },
  { label: "Trekking", href: "/packages?category=trekking" },
  { label: "Spiritual", href: "/packages?category=spiritual" },
  { label: "Explore Map", href: "/explore" },
  { label: "Past Trips", href: "/past-trips" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const wishlist = useAppStore((s) => s.wishlist);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "glass-surface py-3" : "py-6 bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/btt_logo_icon.png" alt="" width={40} height={57} className="h-9 w-auto" priority />
          <Image
            src="/btt_label_trimmed.png"
            alt="Bharath Treks & Tales"
            width={597}
            height={146}
            priority
            className="h-11 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium opacity-80 transition-opacity hover:opacity-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="Search"
            className="hidden h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-foreground/10 md:flex cursor-pointer"
          >
            <Search size={17} />
          </button>
          <Link
            href="/dashboard/wishlist"
            aria-label="Wishlist"
            className="relative hidden h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-foreground/10 md:flex"
          >
            <Heart size={17} />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-saffron text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>
          <ThemeToggle />
          <Button size="sm" variant="saffron" className="hidden md:inline-flex" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <button
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full hover:bg-foreground/10 lg:hidden cursor-pointer"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden glass-surface lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-foreground/10"
                >
                  {link.label}
                </Link>
              ))}
              <Button size="sm" variant="saffron" className="mt-2" asChild>
                <Link href="/login">Login</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
