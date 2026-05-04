"use client";

import {
  useAddFavoritePropertyMutation,
  useGetAuthUserQuery,
  useGetPropertiesQuery,
  useGetTenantQuery,
  useRemoveFavoritePropertyMutation,
} from "@/state/api";
import { useAppSelector } from "@/state/redux";
import { Property } from "@/types/prismaTypes";
import Card from "@/components/Card";
import CardCompact from "@/components/CardCompact";
import { useCallback, useMemo } from "react";

const Listings = () => {
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const filters = useAppSelector((state) => state.global.filters);

  /* ---------------- Auth & Tenant ---------------- */

  const { data: authUser } = useGetAuthUserQuery();

  const cognitoId = authUser?.cognitoInfo?.userId;

  const { data: tenant } = useGetTenantQuery(cognitoId!, {
    skip: !cognitoId,
  });

  /* ---------------- Properties ---------------- */

  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  /* ---------------- Favorites ---------------- */

  const [addFavorite, { isLoading: adding }] = useAddFavoritePropertyMutation();
  const [removeFavorite, { isLoading: removing }] =
    useRemoveFavoritePropertyMutation();

  const favoriteIds = useMemo(() => {
    return new Set(tenant?.favorites?.map((fav: Property) => fav.id) ?? []);
  }, [tenant]);

  const toggleFavorite = useCallback(
    async (propertyId: number) => {
      if (!cognitoId || adding || removing) return;

      if (favoriteIds.has(propertyId)) {
        await removeFavorite({ cognitoId, propertyId });
      } else {
        await addFavorite({ cognitoId, propertyId });
      }
    },
    [addFavorite, removeFavorite, cognitoId, favoriteIds, adding, removing]
  );

  /* ---------------- UX States ---------------- */

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-600">
        Loading properties...
      </div>
    );
  }

  if (isError || !properties) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-600">
        Failed to fetch properties
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-600">
        No properties found for the selected filters
      </div>
    );
  }

  /* ---------------- Render ---------------- */

  return (
    <section className="w-full">
      <h3 className="px-4 text-sm font-bold">
        {properties.length}{" "}
        <span className="font-normal text-gray-700">
          Places in {filters.location}
        </span>
      </h3>

      <div className="flex">
        <div className="w-full p-4">
          {properties.map((property) => {
            const isFavorite = favoriteIds.has(property.id);

            const commonProps = {
              key: property.id,
              property,
              isFavorite,
              onFavoriteToggle: () => toggleFavorite(property.id),
              showFavoriteButton: Boolean(cognitoId),
              propertyLink: `/search/${property.id}`,
            };

            return viewMode === "grid" ? (
              <Card {...commonProps} />
            ) : (
              <CardCompact {...commonProps} />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Listings;
