import {
    collection,
    onSnapshot,
    query,
    doc,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { firebaseCollections } from "@/lib/collections";
import { Matching } from "@/lib/types";

export const matchingService = {
    listenMatchings: (onUpdate: (matchings: Matching[]) => void) => {
        const matchingsRef = collection(db, firebaseCollections.matchings);
        const q = query(matchingsRef);

        return onSnapshot(q, (snapshot) => {
            const matchings = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Matching[];
            onUpdate(matchings);
        });
    },

    updateMatching: async (id: string, data: Partial<Matching>) => {
        const matchingRef = doc(db, firebaseCollections.matchings, id);
        await updateDoc(matchingRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    },
};
