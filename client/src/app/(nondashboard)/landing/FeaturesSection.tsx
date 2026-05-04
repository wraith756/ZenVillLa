"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

/* ---------------- Animations ---------------- */

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
      ease: "easeOut",
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ---------------- Data ---------------- */

interface Feature {
  imageSrc: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}

const FEATURES: Feature[] = [
  {
    imageSrc: "/landing-search3.png",
    title: "Trustworthy and Verified Listings",
    description:
      "Find safe and reliable rental listings with verified details and trusted sources.",
    linkText: "Explore",
    linkHref: "/explore",
  },
  {
    imageSrc: "/landing-search2.png",
    title: "Browse Rental Listings with Ease",
    description:
      "View rental homes effortlessly with clear filters, images, and user-friendly navigation.",
    linkText: "Search",
    linkHref: "/search",
  },
  {
    imageSrc: "/landing-search1.png",
    title: "Simplify Your Rental Search with Advanced Filters",
    description:
      "Narrow down your options using smart filters that match your lifestyle and preferences.",
    linkText: "Discover",
    linkHref: "/discover",
  },
];

/* ---------------- Component ---------------- */

const FeaturesSection = () => {
  return (
    <section className="bg-white py-24 px-6 sm:px-8 lg:px-12 xl:px-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="mx-auto max-w-4xl xl:max-w-6xl">
          <motion.h2
            variants={itemVariants}
            className="mx-auto mb-12 w-full text-center text-3xl font-bold sm:w-2/3"
          >
            Quickly find the home you want using our effective search filters
          </motion.h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 xl:gap-16">
            {FEATURES.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

/* ---------------- Card ---------------- */

const FeatureCard = ({
  imageSrc,
  title,
  description,
  linkText,
  linkHref,
}: Feature) => (
  <div className="text-center">
    <div className="mb-4 flex h-48 items-center justify-center rounded-lg p-4">
      <Image
        src={imageSrc}
        alt={title}
        width={400}
        height={400}
        sizes="(max-width: 768px) 100vw, 33vw"
        className="h-full w-full object-contain"
      />
    </div>

    <h3 className="mb-2 text-xl font-semibold">{title}</h3>

    <p className="mb-4 text-gray-600">{description}</p>

    <Link
      href={linkHref}
      scroll={false}
      className="inline-block rounded border border-gray-300 px-4 py-2 transition hover:bg-gray-100"
      aria-label={linkText}
    >
      {linkText}
    </Link>
  </div>
);

export default FeaturesSection;
