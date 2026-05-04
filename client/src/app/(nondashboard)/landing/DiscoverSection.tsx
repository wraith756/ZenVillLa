"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

/* ---------------- Animations ---------------- */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ---------------- Data ---------------- */

interface DiscoverItem {
  imageSrc: string;
  title: string;
  description: string;
}

const DISCOVER_ITEMS: DiscoverItem[] = [
  {
    imageSrc: "/landing-icon-wand.png",
    title: "Search for Property",
    description:
      "Browse through our extensive collection of rental properties in your desired location.",
  },
  {
    imageSrc: "/landing-icon-calendar.png",
    title: "Book Your Rental",
    description:
      "Lock in your dream rental with ease using verified listings, smooth scheduling, and secure booking.",
  },
  {
    imageSrc: "/landing-icon-heart.png",
    title: "Enjoy Your New Home",
    description:
      "Step into comfort and peace of mind. Your perfect space is ready to be lived in and loved.",
  },
];

/* ---------------- Component ---------------- */

const DiscoverSection = () => {
  return (
    <section className="bg-white py-12 mb-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.8 }}
        variants={containerVariants}
      >
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8 lg:px-12 xl:px-16">
          {/* Heading */}
          <motion.div variants={itemVariants} className="my-12 text-center">
            <h2 className="text-3xl font-semibold leading-tight text-gray-800">
              Discover
            </h2>

            <p className="mt-4 text-lg text-gray-600">
              Find your dream rental property today
            </p>

            <p className="mx-auto mt-2 max-w-3xl text-gray-500">
              Find a home that fits your lifestyle, budget, and timeline — with
              intelligent search filters, verified listings, and trusted
              reviews, renting becomes simple and stress-free.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 xl:gap-16 text-center">
            {DISCOVER_ITEMS.map((item) => (
              <motion.div key={item.title} variants={itemVariants}>
                <DiscoverCard {...item} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

/* ---------------- Card ---------------- */

const DiscoverCard = ({ imageSrc, title, description }: DiscoverItem) => (
  <div className="rounded-lg bg-[#fefcfc] px-4 py-12 shadow-lg md:h-72">
    <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#27272a] p-[0.6rem]">
      <Image
        src={imageSrc}
        alt={title}
        width={30}
        height={30}
        className="object-contain"
      />
    </div>

    <h3 className="mt-4 text-xl font-medium text-gray-800">{title}</h3>

    <p className="mt-2 text-base text-gray-500">{description}</p>
  </div>
);

export default DiscoverSection;
