import { db } from "@/lib/firebase"
import { School, VerificationStatus, Review } from "@/lib/types"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  addDoc,
  Timestamp,
  orderBy,
  limit,
} from "firebase/firestore"

export class SchoolService {
  private static readonly COLLECTION = "schools"
  private static readonly REVIEWS_SUBCOLLECTION = "reviews"

  // Récupérer toutes les écoles
  static async getAllSchools(): Promise<School[]> {
    try {
      const q = query(collection(db, this.COLLECTION))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      } as School))
    } catch (error) {
      console.error("Erreur lors de la récupération des écoles:", error)
      throw error
    }
  }

  // Récupérer une école par ID
  static async getSchoolById(schoolId: string): Promise<School | null> {
    try {
      const docRef = doc(db, this.COLLECTION, schoolId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
          createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date(),
        } as School
      }
      return null
    } catch (error) {
      console.error("Erreur lors de la récupération de l'école:", error)
      throw error
    }
  }

  // Récupérer les écoles par tutorId
  static async getSchoolsByTutorId(tutorId: string): Promise<School[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where("tutorId", "==", tutorId)
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      } as School))
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des écoles du tuteur:",
        error
      )
      throw error
    }
  }

  // Récupérer les avis d'une école
  static async getSchoolReviews(schoolId: string): Promise<Review[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION, schoolId, this.REVIEWS_SUBCOLLECTION),
        orderBy("createdAt", "desc")
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      } as Review))
    } catch (error) {
      console.error("Erreur lors de la récupération des avis:", error)
      throw error
    }
  }

  // Ajouter un avis à une école
  static async addSchoolReview(
    schoolId: string,
    review: Omit<Review, "id" | "createdAt">
  ): Promise<string> {
    try {
      const ref = await addDoc(
        collection(db, this.COLLECTION, schoolId, this.REVIEWS_SUBCOLLECTION),
        {
          ...review,
          createdAt: Timestamp.now(),
        }
      )
      return ref.id
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un avis:", error)
      throw error
    }
  }

  // Mettre à jour le statut de vérification d'une école
  static async updateVerificationStatus(
    schoolId: string,
    status: VerificationStatus,
    message?: string
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, schoolId)
      await updateDoc(docRef, {
        verificationStatus: status,
        ...(message && { verificationMessage: message }),
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut de vérification:",
        error
      )
      throw error
    }
  }

  // Bloquer/débloquer une école
  static async toggleSchoolBlocked(
    schoolId: string,
    isBlocked: boolean
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, schoolId)
      await updateDoc(docRef, {
        isBlocked,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error("Erreur lors du blocage/déblocage de l'école:", error)
      throw error
    }
  }

  // Obtenir les statistiques d'une école
  static async getSchoolStats(schoolId: string): Promise<{
    totalReviews: number
    averageRating: number
    recentReviews: number
  }> {
    try {
      const reviews = await this.getSchoolReviews(schoolId)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const recentReviews = reviews.filter(
        (r) => new Date(r.createdAt) > thirtyDaysAgo
      ).length

      return {
        totalReviews: reviews.length,
        averageRating:
          reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0,
        recentReviews,
      }
    } catch (error) {
      console.error("Erreur lors du calcul des statistiques:", error)
      throw error
    }
  }

  // Mettre à jour les informations d'une école
  static async updateSchool(
    schoolId: string,
    updates: Partial<School>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, schoolId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'école:", error)
      throw error
    }
  }

  // Supprimer une école
  static async deleteSchool(schoolId: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, schoolId)
      await updateDoc(docRef, {
        isDeleted: true,
        deletedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error("Erreur lors de la suppression de l'école:", error)
      throw error
    }
  }

  // Rechercher des écoles par critères
  static async searchSchools(filters: {
    country?: string
    city?: string
    verificationStatus?: VerificationStatus
    isBlocked?: boolean
  }): Promise<School[]> {
    try {
      let q: any = collection(db, this.COLLECTION)
      const conditions = []

      if (filters.country) {
        conditions.push(where("location.country", "==", filters.country))
      }
      if (filters.city) {
        conditions.push(where("location.city", "==", filters.city))
      }
      if (filters.verificationStatus) {
        conditions.push(
          where("verificationStatus", "==", filters.verificationStatus)
        )
      }
      if (filters.isBlocked !== undefined) {
        conditions.push(where("isBlocked", "==", filters.isBlocked))
      }

      if (conditions.length > 0) {
        q = query(q, ...conditions)
      } else {
        q = query(q)
      }

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<School, "id">
        return ({
        ...data,
        id: doc.id,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as School)
      })
    } catch (error) {
      console.error("Erreur lors de la recherche d'écoles:", error)
      throw error
    }
  }
}
