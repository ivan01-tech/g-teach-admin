import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Tutor } from "@/lib/types";
import { listenToProfiles } from "./profiles-thunks";

interface ProfilesState {
    profiles: Tutor[];
    loading: boolean;
    error: string | null;
}

const initialState: ProfilesState = {
    profiles: [],
    loading: false,
    error: null,
};

export const profilesSlice = createSlice({
    name: "profiles",
    initialState,
    reducers: {
        setProfiles: (state, action: PayloadAction<Tutor[]>) => {
            state.profiles = action.payload;
            state.loading = false;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(listenToProfiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(listenToProfiles.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(listenToProfiles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { setProfiles } = profilesSlice.actions;
export default profilesSlice.reducer;