"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const ctaAnimation = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
  viewport: { once: true },
};

const CallToActionSection = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <Image
        src="/landing-call-to-action.jpg"
        alt="Rental search call to action background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      {/* Content */}
      <motion.div
        {...ctaAnimation}
        className="relative mx-auto max-w-4xl xl:max-w-6xl px-6 sm:px-8 lg:px-12 xl:px-16 py-12"
      >
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <h2 className="text-2xl font-bold text-white">
            Find Your Dream Home
          </h2>

          <div className="text-center md:text-left">
            <p className="mb-3 text-white">
              Discover Spaces That Speak Your Style
            </p>

            <div className="flex justify-center gap-4 md:justify-start">
              <button
                type="button"
                onClick={scrollToTop}
                className="rounded-lg bg-white px-6 py-3 font-semibold text-[#27272a] transition hover:bg-[#82828b]"
                aria-label="Search properties"
              >
                Search
              </button>

              <Link
                href="/signup"
                scroll={false}
                className="rounded-lg bg-[#eb8686] px-6 py-3 font-semibold text-white transition hover:bg-[#e45a5a]"
                aria-label="Sign up"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CallToActionSection;
