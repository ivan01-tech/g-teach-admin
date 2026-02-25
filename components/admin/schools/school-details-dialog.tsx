import { School } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { SchoolService } from "@/lib/services/school-service"
import { useToast } from "@/hooks/use-toast"
import { SchoolReviewsList } from "./school-reviews-list"
import { useAppSelector } from "@/lib/hooks"

interface SchoolDetailsDialogProps {
  school: School | null
  isOpen: boolean
  onClose: () => void
}

export function SchoolDetailsDialog({
  school,
  isOpen,
  onClose,
}: SchoolDetailsDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { users } = useAppSelector((state) => state.users)
  const { toast } = useToast()

  const handleToggleBlock = async () => {
    if (!school) return

    setIsLoading(true)
    try {
      const isCurrentlyBlocked = school.verificationStatus === "rejected"
      await SchoolService.toggleSchoolBlocked(school.id, !isCurrentlyBlocked)

      toast({
        title: "Succès",
        description: `École ${isCurrentlyBlocked ? "débloquée" : "bloquée"} avec succès`,
      })
      onClose()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!school) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img
              src={school.logo || "https://via.placeholder.com/40"}
              alt={school.name}
              className="w-10 h-10 rounded"
            />
            {school.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Créateur</p>
              <p className="text-sm">{users.find(u => u.uid === school.tutorId)?.displayName || "Inconnu"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Statut</p>
              <Badge
                variant={
                  school.verificationStatus === "verified"
                    ? "default"
                    : school.verificationStatus === "rejected"
                      ? "destructive"
                      : "secondary"
                }
              >
                {school.verificationStatus}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Localisation</p>
              <p className="text-sm">
                {school.location.city}, {school.location.country}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Adresse</p>
              <p className="text-sm">{school.location.address || "N/A"}</p>
            </div>
          </div>

          {/* Informations d'contact */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Informations de contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm">{school.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Téléphone</p>
                <p className="text-sm">{school.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Site web</p>
                <p className="text-sm">
                  {school.website ? (
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {school.website}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Statistiques</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Nombre d'avis
                </p>
                <p className="text-2xl font-bold">{school.reviewCount || 0}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Note moyenne</p>
                <p className="text-2xl font-bold">{school.rating || 0}/5</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Étudiants totaux
                </p>
                <p className="text-2xl font-bold">{school.totalStudents || 0}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Cours totaux
                </p>
                <p className="text-2xl font-bold">{school.totalLessons || 0}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {school.description && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-gray-600">{school.description}</p>
            </div>
          )}

          {/* À propos */}
          {school.about && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">À propos</h3>
              <p className="text-sm text-gray-600">{school.about}</p>
            </div>
          )}

          {/* Avis */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Avis (Reviews)</h3>
            <SchoolReviewsList schoolId={school.id} />
          </div>

          {/* Actions */}
          <div className="border-t pt-4 flex gap-2">
            <Button
              variant="destructive"
              onClick={handleToggleBlock}
              disabled={isLoading}
            >
              {school.verificationStatus === "rejected"
                ? "Débloquer l'école"
                : "Bloquer l'école"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
