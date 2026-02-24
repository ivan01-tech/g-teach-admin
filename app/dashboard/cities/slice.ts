import { firebaseCollections } from "@/lib/collections";
import { City } from "@/lib/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { collection, onSnapshot } from "firebase/firestore";
import { fetchCities, fetchCityById } from "./thunks";

export interface CityState {
  cities: City[];
  selectedCityId: string | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null; // timestamp
}

// ── Initial state ─────────────────────────────────────────

const initialState: CityState = {
  cities: [],
  selectedCityId: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

// ── Slice ─────────────────────────────────────────────────

const citiesSlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    selectCity: (state, action: PayloadAction<string | null>) => {
      state.selectedCityId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCities: (state, action: PayloadAction<City[]>) => {
      state.cities = action.payload;
      state.lastFetched = Date.now();
    },
    addCityLocally: (state, action: PayloadAction<City>) => {
      state.cities.push(action.payload);
      state.cities.sort((a, b) => a.name.localeCompare(b.name));
    },
    // exemple d'update local optimiste
    updateCityLocally: (
      state,
      action: PayloadAction<{ id: string; name: string }>,
    ) => {
      const city = state.cities.find((c) => c.id === action.payload.id);
      if (city) {
        city.name = action.payload.name;
      }
    },
  },

  extraReducers: (builder) => {
    // fetchCities
    builder
      .addCase(fetchCities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.cities = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Erreur inconnue";
      });

    // fetchCityById
    builder.addCase(fetchCityById.fulfilled, (state, action) => {
      const index = state.cities.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.cities[index] = action.payload;
      } else {
        state.cities.push(action.payload);
      }
    });
  },
});

export const { selectCity, clearError, setCities, updateCityLocally } =
  citiesSlice.actions;
export default citiesSlice.reducer;
