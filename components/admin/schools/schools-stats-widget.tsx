"use client"

import { useEffect, useState } from "react"
import { School } from "@/lib/types"
import { SchoolService } from "@/lib/services/school-service"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Building2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
} from "lucide-react"

interface SchoolStats {
  totalSchools: number
  verifiedSchools: number
  pendingSchools: number
  blockedSchools: number
  totalStudents: number
  averageRating: number
}

export function SchoolsStatsWidget() {
  const [stats, setStats] = useState<SchoolStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const schools = await SchoolService.getAllSchools()

        const verifiedSchools = schools.filter(
          (s) => s.verificationStatus === "verified"
        ).length
        const pendingSchools = schools.filter(
          (s) => s.verificationStatus === "pending"
        ).length
        const blockedSchools = schools.filter(
          (s) => s.verificationStatus === "rejected"
        ).length
        const totalStudents = schools.reduce(
          (sum, s) => sum + (s.totalStudents || 0),
          0
        )
        const averageRating =
          schools.length > 0
            ? schools.reduce((sum, s) => sum + (s.rating || 0), 0) /
              schools.length
            : 0

        setStats({
          totalSchools: schools.length,
          verifiedSchools,
          pendingSchools,
          blockedSchools,
          totalStudents,
          averageRating,
        })
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    {
      label: "Écoles totales",
      value: stats.totalSchools,
      icon: Building2,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Vérifiées",
      value: stats.verifiedSchools,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "En attente",
      value: stats.pendingSchools,
      icon: AlertCircle,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Bloquées",
      value: stats.blockedSchools,
      icon: AlertCircle,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Étudiants totaux",
      value: stats.totalStudents,
      icon: Users,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Note moyenne",
      value: stats.averageRating.toFixed(2),
      icon: TrendingUp,
      color: "bg-orange-50 text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
