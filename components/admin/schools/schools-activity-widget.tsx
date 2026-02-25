"use client"

import { useEffect, useState } from "react"
import { School } from "@/lib/types"
import { SchoolService } from "@/lib/services/school-service"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function SchoolsActivityWidget() {
  const [schools, setSchools] = useState<School[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const data = await SchoolService.getAllSchools()
        // Trier par date de création (plus récentes d'abord)
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setSchools(sorted.slice(0, 10)) // Top 10 plus récentes
      } catch (error) {
        console.error("Erreur:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchools()
  }, [])

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
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Activité Récente des Écoles</h3>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>École</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Créée</TableHead>
              <TableHead>Avis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                  Aucune école
                </TableCell>
              </TableRow>
            ) : (
              schools.map((school) => (
                <TableRow key={school.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        src={school.logo || "https://via.placeholder.com/32"}
                        alt={school.name}
                        className="w-8 h-8 rounded"
                      />
                      <div className="text-sm">
                        <p className="font-medium">{school.name}</p>
                        <p className="text-gray-500 text-xs">
                          {school.location.city}
                        </p>
                      </div>
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
                  <TableCell className="text-sm text-gray-600">
                    {new Date(school.createdAt).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className="font-semibold">{school.reviewCount || 0}</span>
                    {school.rating && (
                      <span className="text-gray-500 ml-1">
                        ({school.rating.toFixed(1)}/5)
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
