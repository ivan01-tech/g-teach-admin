import { useEffect, useState } from "react"
import { School, Review } from "@/lib/types"
import { SchoolService } from "@/lib/services/school-service"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Star, TrendingUp } from "lucide-react"

interface SchoolStatsDetailsProps {
  schoolId: string
}

export function SchoolStatsDetails({ schoolId }: SchoolStatsDetailsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [school, setSchool] = useState<School | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schoolData = await SchoolService.getSchoolById(schoolId)
        const reviewsData = await SchoolService.getSchoolReviews(schoolId)

        setSchool(schoolData)
        setReviews(reviewsData)
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (schoolId) {
      fetchData()
    }
  }, [schoolId])

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />
  }

  if (!school) return null

  // Distribution des notes
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating: `${rating} ★`,
    count: reviews.filter((r) => r.rating === rating).length,
  }))

  // Avis par mois (derniers 6 mois)
  const reviewsByMonth = Array.from({ length: 6 }).map((_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthName = date.toLocaleDateString("fr-FR", { month: "short" })

    return {
      month: monthName,
      reviews: reviews.filter((r) => {
        const reviewDate = new Date(r.createdAt)
        return (
          reviewDate.getMonth() === date.getMonth() &&
          reviewDate.getFullYear() === date.getFullYear()
        )
      }).length,
    }
  }).reverse()

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Note moyenne</p>
              <p className="text-3xl font-bold mt-2">
                {school.rating?.toFixed(1) || 0}/5
              </p>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={
                    i < Math.round(school.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nombre d'avis</p>
              <p className="text-3xl font-bold mt-2">
                {school.reviewCount || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Distribution des notes */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Distribution des notes</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ratingDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rating" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Avis par mois */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Avis par mois (6 derniers mois)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reviewsByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="reviews" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
