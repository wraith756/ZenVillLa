"use client";

import {
  FiltersState,
  setFilters,
  setViewMode,
  toggleFiltersFullOpen,
} from "@/state";
import { useAppSelector } from "@/state/redux";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import debounce from "lodash/debounce";
import { cleanParams, cn, formatPriceValue } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyTypeIcons } from "@/lib/constants";

/* ---------------- Component ---------------- */

const FiltersBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { filters, isFiltersFullOpen, viewMode } = useAppSelector(
    (state) => state.global
  );

  const [searchInput, setSearchInput] = useState(filters.location);

  /* ---------------- URL Sync ---------------- */

  const updateURL = useMemo(
    () =>
      debounce((newFilters: FiltersState) => {
        const cleanFilters = cleanParams(newFilters);
        const params = new URLSearchParams();

        Object.entries(cleanFilters).forEach(([key, value]) => {
          params.set(
            key,
            Array.isArray(value) ? value.join(",") : String(value)
          );
        });

        router.push(`${pathname}?${params.toString()}`);
      }, 400),
    [router, pathname]
  );

  useEffect(() => {
    return () => updateURL.cancel();
  }, [updateURL]);

  /* ---------------- Filter Change ---------------- */

  const handleFilterChange = useCallback(
    <K extends keyof FiltersState>(
      key: K,
      value: string | number | number[],
      isMin: boolean | null
    ) => {
      let newValue: FiltersState[K];

      if (key === "priceRange" || key === "squareFeet") {
        const range = [...filters[key]] as (number | null)[];
        if (isMin !== null) {
          range[isMin ? 0 : 1] = value === "any" ? null : Number(value);
        }
        newValue = range as FiltersState[K];
      } else if (key === "coordinates") {
        newValue =
          value === "any"
            ? ([0, 0] as FiltersState[K])
            : (value as FiltersState[K]);
      } else {
        newValue = value === "any" ? "any" : (value as FiltersState[K]);
      }

      const updatedFilters = { ...filters, [key]: newValue };
      dispatch(setFilters(updatedFilters));
      updateURL(updatedFilters);
    },
    [dispatch, filters, updateURL]
  );

  /* ---------------- Location Search ---------------- */

  const handleLocationSearch = async () => {
    if (!searchInput.trim()) return;

    const controller = new AbortController();

    try {
      const res = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(
          searchInput
        )}.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
        { signal: controller.signal }
      );

      if (!res.ok) return;

      const data = await res.json();

      if (data?.features?.length) {
        const [lng, lat] = data.features[0].geometry.coordinates;

        dispatch(
          setFilters({
            location: searchInput,
            coordinates: [lng, lat],
          })
        );
      }
    } catch (error) {
      if (!(error instanceof DOMException)) {
        console.error("Location search failed:", error);
      }
    }

    return () => controller.abort();
  };

  /* ---------------- Render ---------------- */

  return (
    <div className="flex w-full items-center justify-between py-5">
      {/* Filters */}
      <div className="flex items-center gap-4 p-2">
        {/* All Filters */}
        <Button
          variant="outline"
          className={cn(
            "gap-2 rounded-xl border-primary-400 hover:bg-primary-500 hover:text-primary-100",
            isFiltersFullOpen && "bg-primary-700 text-primary-100"
          )}
          onClick={() => dispatch(toggleFiltersFullOpen())}
        >
          <Filter className="h-4 w-4" />
          All Filters
        </Button>

        {/* Location Search */}
        <div className="flex items-center">
          <Input
            placeholder="Search location"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-40 rounded-l-xl rounded-r-none border-primary-400 border-r-0"
          />
          <Button
            onClick={handleLocationSearch}
            className="rounded-r-xl rounded-l-none border border-primary-400 hover:bg-primary-700 hover:text-primary-50"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Price Range */}
        <PriceRangeFilter
          priceRange={filters.priceRange}
          onChange={handleFilterChange}
        />

        {/* Beds & Baths */}
        <BedsBathsFilter filters={filters} onChange={handleFilterChange} />

        {/* Property Type */}
        <PropertyTypeFilter
          value={filters.propertyType}
          onChange={handleFilterChange}
        />
      </div>

      {/* View Mode */}
      <div className="flex items-center gap-4 p-2">
        <div className="flex rounded-xl border">
          <Button
            variant="ghost"
            onClick={() => dispatch(setViewMode("list"))}
            className={cn(
              "rounded-l-xl px-3 py-1 hover:bg-primary-600 hover:text-primary-50",
              viewMode === "list" && "bg-primary-700 text-primary-50"
            )}
          >
            <List className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => dispatch(setViewMode("grid"))}
            className={cn(
              "rounded-r-xl px-3 py-1 hover:bg-primary-600 hover:text-primary-50",
              viewMode === "grid" && "bg-primary-700 text-primary-50"
            )}
          >
            <Grid className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
