import { useEffect, useState } from "react"
import { Review } from "@/lib/types"
import { SchoolService } from "@/lib/services/school-service"
import { Skeleton } from "@/components/ui/skeleton"
import { Star } from "lucide-react"

interface SchoolReviewsListProps {
  schoolId: string
}

export function SchoolReviewsList({ schoolId }: SchoolReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true)
      try {
        const data = await SchoolService.getSchoolReviews(schoolId)
        setReviews(data)
        setError(null)
      } catch (err) {
        setError("Erreur lors du chargement des avis")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (schoolId) {
      fetchReviews()
    }
  }, [schoolId])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>
  }

  if (reviews.length === 0) {
    return <p className="text-sm text-gray-500">Aucun avis pour cette école</p>
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {reviews.map((review) => (
        <div key={review.id} className="border rounded-lg p-3 bg-gray-50">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {review.studentPhoto && (
                <img
                  src={review.studentPhoto}
                  alt={review.studentName}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div>
                <p className="font-semibold text-sm">{review.studentName}</p>
                <p className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}
