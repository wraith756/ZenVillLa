"use client";

import { FiltersState, initialState, setFilters } from "@/state";
import { useAppSelector } from "@/state/redux";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import debounce from "lodash/debounce";
import { cleanParams, cn, formatEnumString } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { AmenityIcons, PropertyTypeIcons } from "@/lib/constants";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

/* ---------------- Component ---------------- */

const FiltersFull = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { filters, isFiltersFullOpen } = useAppSelector(
    (state) => state.global
  );

  const [localFilters, setLocalFilters] = useState<FiltersState>(
    initialState.filters
  );

  /* ---------------- URL Sync (Debounced) ---------------- */

  const updateURL = useMemo(
    () =>
      debounce((next: FiltersState) => {
        const params = new URLSearchParams();

        Object.entries(cleanParams(next)).forEach(([key, value]) => {
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

  /* ---------------- Handlers ---------------- */

  const handleSubmit = () => {
    dispatch(setFilters(localFilters));
    updateURL(localFilters);
  };

  const handleReset = () => {
    setLocalFilters(initialState.filters);
    dispatch(setFilters(initialState.filters));
    updateURL(initialState.filters);
  };

  const toggleAmenity = useCallback((amenity: AmenityEnum) => {
    setLocalFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }, []);

  /* ---------------- Location Search ---------------- */

  const handleLocationSearch = async () => {
    if (!localFilters.location.trim()) return;

    const controller = new AbortController();

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          localFilters.location
        )}.json?access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        }&fuzzyMatch=true`,
        { signal: controller.signal }
      );

      if (!res.ok) return;

      const data = await res.json();

      if (data?.features?.length) {
        const [lng, lat] = data.features[0].center;
        setLocalFilters((prev) => ({
          ...prev,
          coordinates: [lng, lat],
        }));
      }
    } catch (err) {
      if (!(err instanceof DOMException)) {
        console.error("Location search failed:", err);
      }
    }

    return () => controller.abort();
  };

  if (!isFiltersFullOpen) return null;

  /* ---------------- Render ---------------- */

  return (
    <div className="h-full overflow-auto rounded-lg bg-white px-4 pb-10">
      <div className="flex flex-col space-y-6">
        {/* Location */}
        <Section title="Location">
          <div className="flex items-center">
            <Input
              placeholder="Enter location"
              value={localFilters.location}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              className="rounded-l-xl rounded-r-none border-r-0"
            />
            <Button
              onClick={handleLocationSearch}
              className="rounded-r-xl border border-black hover:bg-primary-700 hover:text-primary-50"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </Section>

        {/* Property Type */}
        <Section title="Property Type">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
              <button
                key={type}
                onClick={() =>
                  setLocalFilters((p) => ({
                    ...p,
                    propertyType: type as PropertyTypeEnum,
                  }))
                }
                className={cn(
                  "flex flex-col items-center rounded-xl border p-4",
                  localFilters.propertyType === type
                    ? "border-black"
                    : "border-gray-200"
                )}
              >
                <Icon className="mb-2 h-6 w-6" />
                {type}
              </button>
            ))}
          </div>
        </Section>

        {/* Price Range */}
        <Section title="Price Range (Monthly)">
          <Slider
            min={0}
            max={10000}
            step={100}
            value={[
              localFilters.priceRange[0] ?? 0,
              localFilters.priceRange[1] ?? 10000,
            ]}
            onValueChange={(value: [number, number]) =>
              setLocalFilters((p) => ({ ...p, priceRange: value }))
            }
          />
        </Section>

        {/* Amenities */}
        <Section title="Amenities">
          <div className="flex flex-wrap gap-2">
            {Object.entries(AmenityIcons).map(([amenity, Icon]) => (
              <button
                key={amenity}
                onClick={() => toggleAmenity(amenity as AmenityEnum)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border p-2",
                  localFilters.amenities.includes(amenity as AmenityEnum)
                    ? "border-black"
                    : "border-gray-200"
                )}
              >
                <Icon className="h-5 w-5" />
                <Label>{formatEnumString(amenity)}</Label>
              </button>
            ))}
          </div>
        </Section>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <Button
            onClick={handleSubmit}
            className="flex-1 rounded-xl bg-primary-700 text-white"
          >
            APPLY
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 rounded-xl"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Helper ---------------- */

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h4 className="mb-2 font-bold">{title}</h4>
    {children}
  </div>
);

export default FiltersFull;
