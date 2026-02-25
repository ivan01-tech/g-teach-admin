"use client"

import { useState } from "react"
import { School } from "@/lib/types"
import { SchoolService } from "@/lib/services/school-service"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface SchoolModerationDialogProps {
  school: School | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate?: () => void
}

export function SchoolModerationDialog({
  school,
  isOpen,
  onClose,
  onStatusUpdate,
}: SchoolModerationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [rejectionMessage, setRejectionMessage] = useState("")
  const { toast } = useToast()

  if (!school) return null

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      await SchoolService.updateVerificationStatus(school.id, "verified")
      toast({
        title: "Succès",
        description: "École vérifiée avec succès",
      })
      onStatusUpdate?.()
      onClose()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de vérifier l'école",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionMessage.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un motif de rejet",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await SchoolService.updateVerificationStatus(
        school.id,
        "rejected",
        rejectionMessage
      )
      toast({
        title: "Succès",
        description: "École rejetée",
      })
      onStatusUpdate?.()
      onClose()
      setRejectionMessage("")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter l'école",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modération - {school.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              Statut actuel:{" "}
              <span className="font-bold">{school.verificationStatus}</span>
            </p>
            {school.verificationMessage && (
              <p className="text-sm text-blue-800 mt-2">
                Message: {school.verificationMessage}
              </p>
            )}
          </div>

          {school.verificationStatus === "pending" && (
            <>
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-3">
                  Motif du rejet (si rejeté):
                </p>
                <Textarea
                  placeholder="Expliquez pourquoi cette école est rejetée..."
                  value={rejectionMessage}
                  onChange={(e) => setRejectionMessage(e.target.value)}
                  className="min-h-24"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleApprove}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin mr-2" />
                  ) : null}
                  Approuver
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isLoading}
                  variant="destructive"
                  className="flex-1"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin mr-2" />
                  ) : null}
                  Rejeter
                </Button>
              </div>
            </>
          )}

          {school.verificationStatus !== "pending" && (
            <div className="p-4 bg-gray-100 rounded text-sm">
              Cette école a déjà été modérée. Statut: {school.verificationStatus}
            </div>
          )}

          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
