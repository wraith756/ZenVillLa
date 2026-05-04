import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ---------------- Types ---------------- */

export type ViewMode = "grid" | "list";
export type AnyOption = "any";

export interface FiltersState {
  location: string;
  beds: string | AnyOption;
  baths: string | AnyOption;
  propertyType: string | AnyOption;
  amenities: string[];
  availableFrom: string | AnyOption;
  priceRange: [number | null, number | null];
  squareFeet: [number | null, number | null];
  coordinates: [number, number]; // [lng, lat]
}

export interface GlobalState {
  filters: FiltersState;
  isFiltersFullOpen: boolean;
  viewMode: ViewMode;
}

/* ---------------- Constants ---------------- */

export const DEFAULT_COORDINATES: [number, number] = [-118.25, 34.05];

export const DEFAULT_FILTERS: FiltersState = {
  location: "Los Angeles",
  beds: "any",
  baths: "any",
  propertyType: "any",
  amenities: [],
  availableFrom: "any",
  priceRange: [null, null],
  squareFeet: [null, null],
  coordinates: DEFAULT_COORDINATES,
};

/* ---------------- Initial State ---------------- */

export const initialState: GlobalState = {
  filters: DEFAULT_FILTERS,
  isFiltersFullOpen: false,
  viewMode: "grid",
};

/* ---------------- Slice ---------------- */

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    resetFilters: (state) => {
      state.filters = DEFAULT_FILTERS;
    },

    toggleFiltersFullOpen: (state) => {
      state.isFiltersFullOpen = !state.isFiltersFullOpen;
    },

    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
  },
});

/* ---------------- Exports ---------------- */

export const { setFilters, resetFilters, toggleFiltersFullOpen, setViewMode } =
  globalSlice.actions;

export default globalSlice.reducer;
