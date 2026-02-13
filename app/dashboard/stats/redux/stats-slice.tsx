import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EngagedUser, PlatformStats } from "@/lib/types";

interface StatsState {
    engagedUsers: EngagedUser[];
    platformStats: PlatformStats | null;
    loading: boolean;
    error: string | null;
}

const initialState: StatsState = {
    engagedUsers: [],
    platformStats: null,
    loading: false,
    error: null,
};

const statsSlice = createSlice({
    name: "stats",
    initialState,
    reducers: {
        setEngagedUsers: (state, action: PayloadAction<EngagedUser[]>) => {
            state.engagedUsers = action.payload;
        },
        setPlatformStats: (state, action: PayloadAction<PlatformStats | null>) => {
            state.platformStats = action.payload;
            state.loading = false;
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

export const { setEngagedUsers, setPlatformStats, setLoading, setError } = statsSlice.actions;
export default statsSlice.reducer;
