import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  orderBy,
  getCountFromServer,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { firebaseCollections } from "@/lib/collections"
import type { ContactInquiry } from "@/lib/types"
import { toSerializable } from "../utils"

export const contactInquiryService = {
  /**
   * Create a new contact inquiry
   */
  createContactInquiry: async (
    data: Omit<ContactInquiry, "id" | "createdAt" | "status">
  ): Promise<ContactInquiry> => {
    const contactInquiriesRef = collection(db, firebaseCollections.contactInquiries)
    const docRef = await addDoc(contactInquiriesRef, {
      ...data,
      status: "pending",
      createdAt: serverTimestamp(),
    })

    return {
      id: docRef.id,
      ...data,
      status: "pending",
      createdAt: new Date(),
    } as ContactInquiry
  },

  /**
   * Get all contact inquiries
   */
  getContactInquiries: async (): Promise<ContactInquiry[]> => {
    const contactInquiriesRef = collection(db, firebaseCollections.contactInquiries)
    const q = query(contactInquiriesRef, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) =>
      toSerializable({ id: doc.id, ...doc.data() }) as ContactInquiry
    )
  },

  /**
   * Get contact inquiries by status
   */
  getContactInquiriesByStatus: async (
    status: "pending" | "resolved" | "archived"
  ): Promise<ContactInquiry[]> => {
    const contactInquiriesRef = collection(db, firebaseCollections.contactInquiries)
    const q = query(
      contactInquiriesRef,
      where("status", "==", status),
      orderBy("createdAt", "desc")
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) =>
      toSerializable({ id: doc.id, ...doc.data() }) as ContactInquiry
    )
  },

  /**
   * Get a single contact inquiry
   */
  getContactInquiry: async (id: string): Promise<ContactInquiry | null> => {
    const docRef = doc(db, firebaseCollections.contactInquiries, id)
    const snapshot = await getDocs(query(collection(db, firebaseCollections.contactInquiries), where("__name__", "==", id)))
    
    if (snapshot.empty) {
      return null
    }

    return toSerializable({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() }) as ContactInquiry
  },

  /**
   * Update contact inquiry status
   */
  updateInquiryStatus: async (
    id: string,
    status: "pending" | "resolved" | "archived"
  ): Promise<void> => {
    const docRef = doc(db, firebaseCollections.contactInquiries, id)
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    })
  },

  /**
   * Get pending inquiries count
   */
  getPendingCount: async (): Promise<number> => {
    const contactInquiriesRef = collection(db, firebaseCollections.contactInquiries)
    const q = query(contactInquiriesRef, where("status", "==", "pending"))
    const snapshot = await getCountFromServer(q)
    return snapshot.data().count
  },

  /**
   * Search contact inquiries by email or name
   */
  searchContactInquiries: async (searchTerm: string): Promise<ContactInquiry[]> => {
    const contactInquiriesRef = collection(db, firebaseCollections.contactInquiries)
    const q = query(contactInquiriesRef, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)

    const allInquiries = snapshot.docs.map((doc) =>
      toSerializable({ id: doc.id, ...doc.data() }) as ContactInquiry
    )

    const term = searchTerm.toLowerCase()
    return allInquiries.filter(
      (inquiry) =>
        inquiry.firstName.toLowerCase().includes(term) ||
        inquiry.lastName.toLowerCase().includes(term) ||
        inquiry.email.toLowerCase().includes(term) ||
        inquiry.subject.toLowerCase().includes(term)
    )
  },
}
