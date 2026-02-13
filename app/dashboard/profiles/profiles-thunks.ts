import { firebaseCollections } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { Tutor, VerificationStatus } from "@/lib/types";
import { setProfiles } from "./profiles-slices";
import { toSerializable } from "@/lib/utils";

export const listenToProfiles = createAsyncThunk(
    "profiles/listen",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const unsubscribe = onSnapshot(
                collection(db, firebaseCollections.tutors),
                (querySnapshot) => {
                    const tutors: Tutor[] = querySnapshot.docs.map((doc) => toSerializable({
                        ...(doc.data() as Tutor),
                        uid: doc.id,
                    }));

                    dispatch(setProfiles(tutors));
                },
                (error) => {
                    console.error("Erreur lors de l'écoute Firestore:", error);
                    rejectWithValue(error.message);
                },
            );

            // We return a function to the caller through resolve/reject in a manual Promise if we want it serializable-safe
            // But since the user's Bootstrap.tsx needs this, we'll keep it but ignore the action in store.ts
            return unsubscribe;
        } catch (error: any) {
            toast.error(error?.message || "Erreur lors de l'écoute des profils");
            return rejectWithValue(error.message);
        }
    },
);

export const updateProfileThunk = createAsyncThunk(
    "profiles/update",
    async ({ uid, data }: { uid: string; data: Partial<Tutor> }, { rejectWithValue }) => {
        try {
            const tutorRef = doc(db, firebaseCollections.tutors, uid);
            await updateDoc(tutorRef, {
                ...data,
                updatedAt: serverTimestamp(),
            });
            toast.success("Profil mis à jour avec succès");
            return { uid, data };
        } catch (error: any) {
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);

export const deleteProfileThunk = createAsyncThunk(
    "profiles/delete",
    async (uid: string, { rejectWithValue }) => {
        try {
            await deleteDoc(doc(db, firebaseCollections.tutors, uid));
            // Also delete from users collection for consistency if needed
            await deleteDoc(doc(db, firebaseCollections.users, uid));
            toast.success("Profil supprimé avec succès");
            return uid;
        } catch (error: any) {
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);

export const validateProfileThunk = createAsyncThunk(
    "profiles/validate",
    async (
        { uid, status, message }: { uid: string; status: VerificationStatus; message?: string },
        { rejectWithValue }
    ) => {
        try {
            const tutorRef = doc(db, firebaseCollections.tutors, uid);
            const userRef = doc(db, firebaseCollections.users, uid);

            const updateData = {
                verificationStatus: status,
                verificationMessage: message || "",
                updatedAt: serverTimestamp(),
            };

            await updateDoc(tutorRef, updateData);
            await updateDoc(userRef, updateData);

            toast.success(`Profil ${status === "verified" ? "validé" : "rejeté"} avec succès`);
            return { uid, status, message };
        } catch (error: any) {
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);
