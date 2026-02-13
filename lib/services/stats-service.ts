import {
    collection,
    onSnapshot,
    query,
    doc,
    getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { firebaseCollections } from "@/lib/collections";
import { EngagedUser, PlatformStats } from "@/lib/types";

export const statsService = {
    listenEngagedUsers: (onUpdate: (users: EngagedUser[]) => void) => {
        const engagedRef = collection(db, firebaseCollections.engagedUsers);
        const q = query(engagedRef);

        return onSnapshot(q, (snapshot) => {
            const users = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as EngagedUser[];
            onUpdate(users);
        });
    },

    listenPlatformStats: (onUpdate: (stats: PlatformStats | null) => void) => {
        const statsRef = collection(db, firebaseCollections.stats);
        // Assuming a single document for global stats, e.g., 'global'
        const q = query(statsRef);

        return onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                onUpdate({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as PlatformStats);
            } else {
                onUpdate(null);
            }
        });
    },
};
