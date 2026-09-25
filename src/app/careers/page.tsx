"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Briefcase, MapPin } from "lucide-react";

const openings = [
  {
    title: "Trek Leader",
    type: "Full-time",
    location: "Bangalore",
    description: "Lead groups on treks across the Western Ghats. Must be physically fit, first-aid certified and passionate about the outdoors.",
  },
  {
    title: "Operations Coordinator",
    type: "Full-time",
    location: "Chennai",
    description: "Manage bookings, coordinate transport and accommodation. Strong organisational skills required.",
  },
  {
    title: "Content Creator",
    type: "Freelance / Contract",
    location: "Remote",
    description: "Create reels, blogs and social media content from our trips. Photography and video skills essential.",
  },
];

export default function CareersPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="font-heading text-4xl font-bold">Careers</h1>
          <p className="mt-3 max-w-lg text-sm text-foreground/60">
            Love the outdoors and want to make it your career? We&apos;re always looking for passionate people.
          </p>

          <div className="mt-10 space-y-6">
            {openings.map((job) => (
              <div key={job.title} className="rounded-2xl border border-foreground/10 bg-surface p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-lg font-bold">{job.title}</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-foreground/50">
                      <span className="flex items-center gap-1"><Briefcase size={12} /> {job.type}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                    </div>
                    <p className="mt-3 text-sm text-foreground/70">{job.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-foreground/10 bg-surface p-6 text-center">
            <p className="text-sm text-foreground/60">
              Don&apos;t see a role that fits? Send your resume to{" "}
              <a href="mailto:careers@bharathtreksandtales.com" className="text-saffron hover:text-saffron-light">
                careers@bharathtreksandtales.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
