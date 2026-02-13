import { configureStore } from "@reduxjs/toolkit";
import { listenerMiddleware } from "./middleware/listener";
import { setupEmailSideEffects } from "./middleware/email-side-effects";
import authReducer from "@/app/auth/auth-slice";
import userReducer from "@/app/dashboard/users/redux/user-slice";
import profilesReducer from "@/app/dashboard/profiles/profiles-slices";
import matchingsReducer from "@/app/dashboard/matchings/redux/matching-slice";
import statsReducer from "@/app/dashboard/stats/redux/stats-slice";


// Initialize side effects

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    profiles: profilesReducer,
    matchings: matchingsReducer,
    stats: statsReducer,
  },


  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "auth/setUser",
          "users/initListener/fulfilled",
          "profiles/listen/fulfilled",
          "stats/initListeners/fulfilled",
          "matchings/initListener/fulfilled"
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          "payload.createdAt",
          "payload.updatedAt",
          "payload.contactDate",
          "payload.acceptedAt",
          "payload.closedAt",
          "payload.refusedAt",
          // For array payloads (e.g., matching lists)
          /payload\.\d+\.createdAt/,
          /payload\.\d+\.updatedAt/,
          /payload\.\d+\.contactDate/,
          /payload\.\d+\.acceptedAt/,
          /payload\.\d+\.closedAt/,
          /payload\.\d+\.refusedAt/,
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          "auth.user",
          // Ignore timestamp fields in state arrays
          /matching\.allMatchings\.\d+\.createdAt/,
          /matching\.allMatchings\.\d+\.updatedAt/,
          /matching\.allMatchings\.\d+\.contactDate/,
          /matching\.allMatchings\.\d+\.acceptedAt/,
          /matching\.allMatchings\.\d+\.closedAt/,
          /matching\.allMatchings\.\d+\.refusedAt/,
          /matching\.pendingMatchings\.\d+\.createdAt/,
          /matching\.pendingMatchings\.\d+\.updatedAt/,
          /matching\.pendingMatchings\.\d+\.contactDate/,
          /matching\.pendingMatchings\.\d+\.acceptedAt/,
          /matching\.pendingMatchings\.\d+\.closedAt/,
          /matching\.pendingMatchings\.\d+\.refusedAt/,
          /bookings\..*\.\d+\.createdAt/,
          /bookings\..*\.\d+\.updatedAt/,
          /tutors\..*\.\d+\.createdAt/,
          /tutors\..*\.\d+\.updatedAt/,
          /favorites\..*\.\d+\.createdAt/,
          /favorites\..*\.\d+\.updatedAt/,
          /matching.manualFollowupMatching\.contactDate/,
          /matching.manualFollowupMatching\.acceptedAt/,
          /matching.manualFollowupMatching\.closedAt/,
          /matching.manualFollowupMatching\.refusedAt/,
          /matching.manualFollowupMatching\.createdAt/,
          /matching.manualFollowupMatching\.updatedAt/,
          /matching.manualFollowupMatching\.contactDate/,
          /matching.manualFollowupMatching\.acceptedAt/,
          /matching.manualFollowupMatching\.closedAt/,
          /matching.manualFollowupMatching\.refusedAt/,
          /matching.manualFollowupMatching\.createdAt/,
          /matching.manualFollowupMatching\.updatedAt/,
        ],
      },
    }).prepend(listenerMiddleware.middleware),
})



setupEmailSideEffects();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
