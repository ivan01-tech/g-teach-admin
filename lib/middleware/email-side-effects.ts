// emailSideEffects.ts
import { startAppListening } from "./listener";
import { signUp } from "@/app/auth/thunks";
import {
  sendAccountEmail,
  sendValidationEmail,
} from "../services/emails/sendEmails";
import { validateProfileThunk } from "@/app/dashboard/profiles/profiles-thunks";

let isRegistered = false;

/**
 * Registers side effects related to email notifications.
 * MUST be called once when the store is created.
 */
export const setupEmailSideEffects = () => {
  if (isRegistered) return;
  isRegistered = true;

  console.log("📨 Email side effects registered");

  // 🔹 SIGN UP EMAIL
  startAppListening({
    actionCreator: signUp.fulfilled,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      const user = action.payload;
      if (!user) return;

      const { password } = action.meta.arg;

      try {
        await sendAccountEmail({
          to: user.email,
          displayName: user.displayName,
          email: user.email,
          password,
          role: user.role,
        });

        console.log(`✅ Welcome email sent to ${user.email}`);
      } catch (error) {
        console.error("❌ Welcome email failed:", error);
      }
    },
  });

  // 🔹 PROFILE VALIDATION EMAIL
  startAppListening({
    actionCreator: validateProfileThunk.fulfilled,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      const { uid, status, message } = action.payload;
      const state = listenerApi.getState();

      const tutor = state.profiles.profiles.find((t) => t.uid === uid);
      const user = state.users.users.find((u) => u.uid === uid);

      if (!tutor || !user) return;

      try {
        await sendValidationEmail({
          to: tutor.email,
          status,
          displayName: tutor.displayName,
          email: tutor.email,
          role: user.role,
          feedbackMessage: message,
        });

        console.log(`✅ Validation email sent to ${tutor.email}`);
      } catch (error) {
        console.error("❌ Validation email failed:", error);
      }
    },
  });
};
