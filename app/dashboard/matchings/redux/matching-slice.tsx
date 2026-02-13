import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Matching } from "@/lib/types";

interface MatchingState {
    matchings: Matching[];
    loading: boolean;
    error: string | null;
}

const initialState: MatchingState = {
    matchings: [],
    loading: false,
    error: null,
};

const matchingSlice = createSlice({
    name: "matchings",
    initialState,
    reducers: {
        setMatchings: (state, action: PayloadAction<Matching[]>) => {
            state.matchings = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { setMatchings, setLoading, setError } = matchingSlice.actions;
export default matchingSlice.reducer;
