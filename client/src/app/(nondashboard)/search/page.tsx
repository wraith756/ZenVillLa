"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import { cleanParams } from "@/lib/utils";
import { setFilters } from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";

import FiltersBar from "./FiltersBar";
import FiltersFull from "./FiltersFull";
import Map from "./Map";
import Listings from "./Listings";
import { FiltersState } from "@/state";

/* ---------------- Helpers ---------------- */

const parseSearchParams = (params: URLSearchParams): Partial<FiltersState> => {
  const parsed: Partial<FiltersState> = {};

  params.forEach((value, key) => {
    switch (key) {
      case "priceRange":
      case "squareFeet":
        parsed[key] = value
          .split(",")
          .map((v) => (v ? Number(v) : null)) as any;
        break;

      case "coordinates":
        parsed[key] = value.split(",").map(Number) as any;
        break;

      default:
        parsed[key as keyof FiltersState] = value === "any" ? null : value;
    }
  });

  return parsed;
};

/* ---------------- Component ---------------- */

const SearchPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );

  /* ---------------- URL → Redux Sync ---------------- */

  const initialFilters = useMemo(() => {
    const parsed = parseSearchParams(searchParams);
    return cleanParams(parsed);
  }, [searchParams]);

  useEffect(() => {
    if (Object.keys(initialFilters).length === 0) return;
    dispatch(setFilters(initialFilters));
  }, [dispatch, initialFilters]);

  /* ---------------- Render ---------------- */

  return (
    <div
      className="mx-auto flex w-full flex-col px-5"
      style={{
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      <FiltersBar />

      <div className="mb-5 flex flex-1 gap-3 overflow-hidden">
        {/* Full Filters */}
        <aside
          className={`h-full overflow-auto transition-all duration-300 ease-in-out ${
            isFiltersFullOpen
              ? "visible w-3/12 opacity-100"
              : "invisible w-0 opacity-0"
          }`}
        >
          <FiltersFull />
        </aside>

        {/* Map */}
        <Map />

        {/* Listings */}
        <section className="basis-4/12 overflow-y-auto">
          <Listings />
        </section>
      </div>
    </div>
  );
};

export default SearchPage;
