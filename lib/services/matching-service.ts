import {
    collection,
    onSnapshot,
    query,
    doc,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Matching } from "@/lib/types";
import { firebaseCollections } from "@/lib/collections";
import { toSerializable } from "../utils";

export const matchingService = {
    listenMatchings: (onUpdate: (matchings: Matching[]) => void) => {
        const matchingsRef = collection(db, firebaseCollections.matchings);
        const q = query(matchingsRef);

        return onSnapshot(q, (snapshot) => {
            const matchings = snapshot.docs.map((doc) => toSerializable({
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
