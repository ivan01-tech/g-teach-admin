import { firebaseCollections } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { City } from "@/lib/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, onSnapshot } from "firebase/firestore";
import { setCities } from "./slice";

// ── Thunks ────────────────────────────────────────────────

export const fetchCities = createAsyncThunk<
  (unsub: () => void) => void,
  void,
  { rejectValue: string }
>("cities/fetchCities", async (_, { rejectWithValue, dispatch }) => {
  try {
    const unsubscribe = onSnapshot(
      collection(db, firebaseCollections.cities),
      (querySnapshot) => {
        const tutors: City[] = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as City),
          uid: doc.id,
        }));

        dispatch(setCities(tutors));
      },
      (error) => {
        console.error("Erreur lors de l'écoute Firestore:", error);
        rejectWithValue(error.message);
      },
    );

    return () => unsubscribe;
  } catch (err: any) {
    return rejectWithValue(
      err.message || "Erreur lors du chargement des villes",
    );
  }
});

export const fetchCityById = createAsyncThunk<
  City,
  string,
  { rejectValue: string }
>("cities/fetchCityById", async (cityId, { rejectWithValue }) => {
  try {
    await new Promise((r) => setTimeout(r, 400));
    // Simulation
    const cities = [
      { id: "1", name: "Paris", country: "France" },
      { id: "2", name: "Tokyo", country: "Japan" },
    ];
    const city = cities.find((c) => c.id === cityId);
    if (!city) throw new Error("Ville non trouvée");
    return city;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

