import { createAsyncThunk } from "@reduxjs/toolkit";
import { statsService } from "@/lib/services/stats-service";
import { setEngagedUsers, setPlatformStats, setLoading, setError } from "./stats-slice";

export const initStatsListeners = createAsyncThunk(
    "stats/initListeners",
    async (_, { dispatch }) => {
        dispatch(setLoading(true));
        try {
            const unsubUsers = statsService.listenEngagedUsers((users) => {
                dispatch(setEngagedUsers(users));
            });

            const unsubPlatform = statsService.listenPlatformStats((stats) => {
                dispatch(setPlatformStats(stats));
            });

            return () => {
                unsubUsers();
                unsubPlatform();
            };
        } catch (error: any) {
            dispatch(setError(error.message));
            throw error;
        }
    }
);
