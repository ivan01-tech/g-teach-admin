import { useState, useCallback } from "react"
import { School } from "@/lib/types"
import { SchoolService } from "@/lib/services/school-service"

interface UseSchoolsReturn {
  schools: School[]
  isLoading: boolean
  error: string | null
  fetchSchools: () => Promise<void>
  blockSchool: (schoolId: string) => Promise<void>
  unblockSchool: (schoolId: string) => Promise<void>
  verifySchool: (schoolId: string) => Promise<void>
  rejectSchool: (schoolId: string, message?: string) => Promise<void>
  updateSchool: (schoolId: string, updates: Partial<School>) => Promise<void>
}

export function useSchools(): UseSchoolsReturn {
  const [schools, setSchools] = useState<School[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSchools = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await SchoolService.getAllSchools()
      setSchools(data)
      setError(null)
    } catch (err) {
      setError("Erreur lors du chargement des écoles")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const blockSchool = useCallback(async (schoolId: string) => {
    try {
      await SchoolService.updateVerificationStatus(
        schoolId,
        "rejected",
        "Bloquée par l'administrateur"
      )
      setSchools((prev) =>
        prev.map((s) =>
          s.id === schoolId
            ? { ...s, verificationStatus: "rejected" as const }
            : s
        )
      )
    } catch (err) {
      setError("Erreur lors du blocage de l'école")
      throw err
    }
  }, [])

  const unblockSchool = useCallback(async (schoolId: string) => {
    try {
      await SchoolService.updateVerificationStatus(schoolId, "verified")
      setSchools((prev) =>
        prev.map((s) =>
          s.id === schoolId
            ? { ...s, verificationStatus: "verified" as const }
            : s
        )
      )
    } catch (err) {
      setError("Erreur lors du déblocage de l'école")
      throw err
    }
  }, [])

  const verifySchool = useCallback(async (schoolId: string) => {
    try {
      await SchoolService.updateVerificationStatus(schoolId, "verified")
      setSchools((prev) =>
        prev.map((s) =>
          s.id === schoolId
            ? { ...s, verificationStatus: "verified" as const }
            : s
        )
      )
    } catch (err) {
      setError("Erreur lors de la vérification de l'école")
      throw err
    }
  }, [])

  const rejectSchool = useCallback(async (schoolId: string, message?: string) => {
    try {
      await SchoolService.updateVerificationStatus(
        schoolId,
        "rejected",
        message
      )
      setSchools((prev) =>
        prev.map((s) =>
          s.id === schoolId
            ? { ...s, verificationStatus: "rejected" as const }
            : s
        )
      )
    } catch (err) {
      setError("Erreur lors du rejet de l'école")
      throw err
    }
  }, [])

  const updateSchool = useCallback(
    async (schoolId: string, updates: Partial<School>) => {
      try {
        await SchoolService.updateSchool(schoolId, updates)
        setSchools((prev) =>
          prev.map((s) =>
            s.id === schoolId
              ? { ...s, ...updates }
              : s
          )
        )
      } catch (err) {
        setError("Erreur lors de la mise à jour de l'école")
        throw err
      }
    },
    []
  )

  return {
    schools,
    isLoading,
    error,
    fetchSchools,
    blockSchool,
    unblockSchool,
    verifySchool,
    rejectSchool,
    updateSchool,
  }
}
