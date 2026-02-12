import { configureStore } from "@reduxjs/toolkit";
import { listenerMiddleware } from "./middleware/listener";
import { setupEmailSideEffects } from "./middleware/email-side-effects";
import authReducer from "@/app/auth/auth-slice";
import userReducer from "@/app/dashboard/users/redux/user-slice";
import profilesReducer from "@/app/dashboard/profiles/profiles-slices";

// Initialize side effects

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    profiles: profilesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["auth/setUser"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.createdAt"],
        // Ignore these paths in the state
        ignoredPaths: ["auth.user"],
      },
    }).prepend(listenerMiddleware.middleware),
});
setupEmailSideEffects();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
