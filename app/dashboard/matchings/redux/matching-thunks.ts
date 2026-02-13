import { createAsyncThunk } from "@reduxjs/toolkit";
import { matchingService } from "@/lib/services/matching-service";
import { setMatchings, setLoading, setError } from "./matching-slice";

export const initMatchingsListener = createAsyncThunk(
    "matchings/initListener",
    async (_, { dispatch }) => {
        dispatch(setLoading(true));
        try {
            return new Promise<(unsub: () => void) => void>((resolve) => {
                let isFirstSnapshot = true;
                const unsubscribe = matchingService.listenMatchings((matchings) => {
                    dispatch(setMatchings(matchings));
                    if (isFirstSnapshot) {
                        isFirstSnapshot = false;
                        resolve(() => unsubscribe);
                    }
                });
            });
        } catch (error: any) {
            dispatch(setError(error.message));
            throw error;
        }
    }
);
