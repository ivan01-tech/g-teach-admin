"use client"

import { useEffect, useState } from "react"
import { School, VerificationStatus } from "@/lib/types"
import { SchoolService } from "@/lib/services/school-service"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { SchoolDetailsDialog } from "./school-details-dialog"
import { Loader2, Eye, Lock, Unlock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useAppSelector } from "@/lib/hooks"

export function AdminSchoolsList() {
  const [schools, setSchools] = useState<School[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { toast } = useToast()
const { users } = useAppSelector((state) => state.users)
  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchSchools = async () => {
    setIsLoading(true)
    try {
      const data = await SchoolService.getAllSchools()
      setSchools(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les écoles",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (school: School) => {
    setSelectedSchool(school)
    setDialogOpen(true)
  }

  const handleToggleBlock = async (
    e: React.MouseEvent,
    school: School
  ) => {
    e.stopPropagation()
    setActionLoading(school.id)

    try {
      const isCurrentlyBlocked = school.verificationStatus === "rejected"
      await SchoolService.updateVerificationStatus(
        school.id,
        isCurrentlyBlocked ? "verified" : "rejected",
        isCurrentlyBlocked
          ? undefined
          : "Bloquée par l'administrateur"
      )

      setSchools(
        schools.map((s) =>
          s.id === school.id
            ? {
                ...s,
                verificationStatus: isCurrentlyBlocked
                  ? ("verified" as VerificationStatus)
                  : ("rejected" as VerificationStatus),
              }
            : s
        )
      )

      toast({
        title: "Succès",
        description: `École ${isCurrentlyBlocked ? "débloquée" : "bloquée"} avec succès`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'école",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleVerify = async (e: React.MouseEvent, school: School) => {
    e.stopPropagation()
    setActionLoading(school.id)

    try {
      await SchoolService.updateVerificationStatus(school.id, "verified")
      setSchools(
        schools.map((s) =>
          s.id === school.id
            ? { ...s, verificationStatus: "verified" as VerificationStatus }
            : s
        )
      )

      toast({
        title: "Succès",
        description: "École vérifiée avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de vérifier l'école",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const filteredSchools = schools.filter((school) => {
    const matchesStatus =
      filterStatus === "all" || school.verificationStatus === filterStatus
    const matchesSearch =
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.location.city.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSearch
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  return (
    <>
      {/* Filtres */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Rechercher par nom ou ville..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="verified">Vérifiée</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="rejected">Bloquée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Nom</TableHead>
              <TableHead>Localisation</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-center">Avis</TableHead>
              <TableHead className="text-center">Note</TableHead>
              <TableHead className="text-center">Étudiants</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Aucune école trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredSchools.map((school) => (
                <TableRow
                  key={school.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewDetails(school)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={school.logo || "https://via.placeholder.com/40"}
                        alt={school.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-semibold text-sm">{school.name}</p>
                        {/* <p className="text-xs text-gray-500">{school.tutorId}</p> */}
                         <p className="text-sm">{users.find(u => u.uid === school.tutorId)?.displayName || "Inconnu"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{school.location.city}</p>
                      <p className="text-gray-500">{school.location.country}</p>
                    </div>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="text-center">
                    {school.reviewCount || 0}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-semibold">{school.rating || 0}</span>
                    <span className="text-gray-500">/5</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {school.totalStudents || 0}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleViewDetails(school)}
                        disabled={actionLoading === school.id}
                      >
                        <Eye size={16} />
                      </Button>

                      {school.verificationStatus === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleVerify(e, school)}
                          disabled={actionLoading === school.id}
                        >
                          Vérifier
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant={
                          school.verificationStatus === "rejected"
                            ? "default"
                            : "destructive"
                        }
                        onClick={(e) => handleToggleBlock(e, school)}
                        disabled={actionLoading === school.id}
                      >
                        {actionLoading === school.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : school.verificationStatus === "rejected" ? (
                          <>
                            <Unlock size={16} />
                            <span className="ml-1">Débloquer</span>
                          </>
                        ) : (
                          <>
                            <Lock size={16} />
                            <span className="ml-1">Bloquer</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Dialog */}
      <SchoolDetailsDialog
        school={selectedSchool}
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          fetchSchools() // Refresh après fermeture
        }}
      />
    </>
  )
}
