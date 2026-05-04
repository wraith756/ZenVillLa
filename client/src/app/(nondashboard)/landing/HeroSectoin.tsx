"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

const heroAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
};

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    // TODO: integrate with router or search API
    console.log("Searching for:", searchQuery);
  }, [searchQuery]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="/landing-splash.jpg"
        alt="Rental platform hero background"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      {/* Content */}
      <motion.div
        {...heroAnimation}
        className="absolute top-1/3 w-full text-center"
      >
        <div className="mx-auto max-w-4xl px-6 sm:px-12">
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            Start your journey to finding the perfect place to call home
          </h1>

          <p className="mb-8 text-lg text-white sm:text-xl">
            Explore our wide range of rental properties tailored to fit your
            lifestyle and needs.
          </p>

          {/* Search Bar */}
          <div
            className="mx-auto flex max-w-lg"
            role="search"
            aria-label="Property search"
          >
            <label htmlFor="search" className="sr-only">
              Search properties
            </label>

            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, neighborhood or address"
              className="h-12 w-full rounded-l-xl border-none bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-[#eb8686]"
            />

            <Button
              onClick={handleSearch}
              className="h-12 rounded-l-none rounded-r-xl bg-[#eb8686] px-6 text-white hover:bg-[#e45a5a]"
            >
              Search
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
