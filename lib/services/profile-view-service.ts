import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  getCountFromServer,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { firebaseCollections } from "@/lib/collections"
import type { ProfileView } from "@/lib/types"
import { toSerializable } from "../utils"

export const profileViewService = {
  /**
   * Record a profile view
   */
  recordProfileView: async (
    tutorId: string,
    viewerId?: string,
    device?: string,
    browser?: string
  ): Promise<void> => {
    const profileViewsRef = collection(db, firebaseCollections.profileViews)
    await addDoc(profileViewsRef, {
      tutorId,
      viewerId: viewerId || null,
      viewedAt: serverTimestamp(),
      device: device || null,
      browser: browser || null,
    })
  },

  /**
   * Get total view count for a specific tutor
   */
  getTutorViewCount: async (tutorId: string): Promise<number> => {
    const profileViewsRef = collection(db, firebaseCollections.profileViews)
    const q = query(profileViewsRef, where("tutorId", "==", tutorId))
    const snapshot = await getCountFromServer(q)
    return snapshot.data().count
  },

  /**
   * Get all profile views for a tutor (with pagination support)
   */
  getTutorProfileViews: async (
    tutorId: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<ProfileView[]> => {
    const profileViewsRef = collection(db, firebaseCollections.profileViews)
    const q = query(profileViewsRef, where("tutorId", "==", tutorId))
    const snapshot = await getDocs(q)
    return snapshot.docs
      .slice(offset, offset + limit)
      .map((doc) => toSerializable({ id: doc.id, ...doc.data() }) as ProfileView)
  },

  /**
   * Get total profile views across all tutors
   */
  getTotalProfileViews: async (): Promise<number> => {
    const profileViewsRef = collection(db, firebaseCollections.profileViews)
    const snapshot = await getCountFromServer(query(profileViewsRef))
    return snapshot.data().count
  },

  /**
   * Get profile view count by tutor (for analytics)
   */
  getProfileViewsByTutor: async (): Promise<Record<string, number>> => {
    const profileViewsRef = collection(db, firebaseCollections.profileViews)
    const q = query(profileViewsRef)
    const snapshot = await getDocs(q)

    const counts: Record<string, number> = {}
    snapshot.docs.forEach((doc) => {
      const tutorId = doc.data().tutorId
      counts[tutorId] = (counts[tutorId] || 0) + 1
    })
    return counts
  },

  /**
   * Get unique viewers count for a tutor
   */
  getTutorUniqueViewers: async (tutorId: string): Promise<number> => {
    const profileViewsRef = collection(db, firebaseCollections.profileViews)
    const q = query(profileViewsRef, where("tutorId", "==", tutorId))
    const snapshot = await getDocs(q)

    const uniqueViewers = new Set<string>()
    snapshot.docs.forEach((doc) => {
      const viewerId = doc.data().viewerId
      if (viewerId) {
        uniqueViewers.add(viewerId)
      }
    })
    return uniqueViewers.size
  },

  /**
   * Get anonymous views count for a tutor
   */
  getTutorAnonymousViews: async (tutorId: string): Promise<number> => {
    const profileViewsRef = collection(db, firebaseCollections.profileViews)
    const q = query(profileViewsRef, where("tutorId", "==", tutorId))
    const snapshot = await getDocs(q)

    let anonymousCount = 0
    snapshot.docs.forEach((doc) => {
      if (!doc.data().viewerId) {
        anonymousCount++
      }
    })
    return anonymousCount
  },
}
