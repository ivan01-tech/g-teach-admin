# Exemples d'utilisation - Système d'Administration des Écoles

## Exemple 1: Composant Simple avec Liste

```typescript
'use client'

import { useSchools } from '@/hooks/use-schools'
import { AdminSchoolsList } from '@/components/admin/schools'

export function MySchoolsPage() {
  const { schools, isLoading, fetchSchools } = useSchools()

  return (
    <div>
      <h1>Mes Écoles</h1>
      {isLoading ? <p>Chargement...</p> : <AdminSchoolsList />}
      <button onClick={fetchSchools}>Rafraîchir</button>
    </div>
  )
}
```

## Exemple 2: Gestion d'une École Spécifique

```typescript
'use client'

import { useEffect, useState } from 'react'
import { School } from '@/lib/types'
import { SchoolService } from '@/lib/services/school-service'

export function SchoolDetail({ schoolId }: { schoolId: string }) {
  const [school, setSchool] = useState<School | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSchool = async () => {
      const data = await SchoolService.getSchoolById(schoolId)
      setSchool(data)
      setIsLoading(false)
    }

    fetchSchool()
  }, [schoolId])

  const handleVerify = async () => {
    if (!school) return
    try {
      await SchoolService.updateVerificationStatus(school.id, 'verified')
      alert('École vérifiée!')
    } catch (error) {
      alert('Erreur: ' + error)
    }
  }

  if (isLoading) return <div>Chargement...</div>
  if (!school) return <div>École non trouvée</div>

  return (
    <div>
      <h1>{school.name}</h1>
      <p>Statut: {school.verificationStatus}</p>
      <p>Avis: {school.reviewCount}</p>
      <p>Note: {school.rating}/5</p>

      {school.verificationStatus === 'pending' && (
        <button onClick={handleVerify}>Vérifier cette école</button>
      )}
    </div>
  )
}
```

## Exemple 3: Afficher les Avis d'une École

```typescript
'use client'

import { useEffect, useState } from 'react'
import { Review } from '@/lib/types'
import { SchoolService } from '@/lib/services/school-service'
import { Star } from 'lucide-react'

export function SchoolReviews({ schoolId }: { schoolId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await SchoolService.getSchoolReviews(schoolId)
      setReviews(data)
    }

    fetchReviews()
  }, [schoolId])

  return (
    <div>
      <h2>Avis ({reviews.length})</h2>
      {reviews.map(review => (
        <div key={review.id} className="border p-4 rounded mb-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold">{review.studentName}</p>
              <p className="text-sm text-gray-600">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < review.rating ? 'gold' : 'none'}
                />
              ))}
            </div>
          </div>
          <p className="mt-2">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}
```

## Exemple 4: Recherche et Filtrage Avancé

```typescript
'use client'

import { useState } from 'react'
import { SchoolService } from '@/lib/services/school-service'
import { School } from '@/lib/types'

export function AdvancedSchoolSearch() {
  const [results, setResults] = useState<School[]>([])
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [status, setStatus] = useState<'verified' | 'pending' | 'rejected' | ''>('')

  const handleSearch = async () => {
    const filters = {
      country: country || undefined,
      city: city || undefined,
      verificationStatus: (status || undefined) as any,
    }

    const schools = await SchoolService.searchSchools(filters)
    setResults(schools)
  }

  return (
    <div>
      <input
        placeholder="Pays"
        value={country}
        onChange={e => setCountry(e.target.value)}
      />
      <input
        placeholder="Ville"
        value={city}
        onChange={e => setCity(e.target.value)}
      />
      <select value={status} onChange={e => setStatus(e.target.value as any)}>
        <option value="">Tous les statuts</option>
        <option value="verified">Vérifiée</option>
        <option value="pending">En attente</option>
        <option value="rejected">Rejetée</option>
      </select>
      <button onClick={handleSearch}>Rechercher</button>

      <div>
        {results.map(school => (
          <div key={school.id} className="border p-3 mb-2">
            <p className="font-bold">{school.name}</p>
            <p>{school.location.city}, {school.location.country}</p>
            <span className="bg-blue-100 px-2 py-1 rounded text-sm">
              {school.verificationStatus}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Exemple 5: Dashboard Statistiques

```typescript
'use client'

import { useEffect, useState } from 'react'
import { SchoolService } from '@/lib/services/school-service'
import { School } from '@/lib/types'

export function SchoolsDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    avgRating: 0,
    totalReviews: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      const schools = await SchoolService.getAllSchools()

      const totalReviews = schools.reduce(
        (sum, s) => sum + (s.reviewCount || 0),
        0
      )
      const avgRating =
        schools.length > 0
          ? schools.reduce((sum, s) => sum + (s.rating || 0), 0) / schools.length
          : 0

      setStats({
        total: schools.length,
        verified: schools.filter(s => s.verificationStatus === 'verified').length,
        pending: schools.filter(s => s.verificationStatus === 'pending').length,
        avgRating: avgRating,
        totalReviews,
      })
    }

    loadStats()
  }, [])

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-blue-50 p-4 rounded">
        <p className="text-gray-600">Total d'écoles</p>
        <p className="text-3xl font-bold">{stats.total}</p>
      </div>
      <div className="bg-green-50 p-4 rounded">
        <p className="text-gray-600">Vérifiées</p>
        <p className="text-3xl font-bold">{stats.verified}</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded">
        <p className="text-gray-600">En attente</p>
        <p className="text-3xl font-bold">{stats.pending}</p>
      </div>
      <div className="bg-purple-50 p-4 rounded">
        <p className="text-gray-600">Note moyenne</p>
        <p className="text-3xl font-bold">{stats.avgRating.toFixed(1)}</p>
      </div>
    </div>
  )
}
```

## Exemple 6: Modération en Masse

```typescript
'use client'

import { useState } from 'react'
import { SchoolService } from '@/lib/services/school-service'

export function BulkSchoolModeration() {
  const [selectedSchools, setSelectedSchools] = useState<string[]>([])
  const [action, setAction] = useState<'verify' | 'reject'>('verify')

  const handleBulkAction = async () => {
    for (const schoolId of selectedSchools) {
      try {
        if (action === 'verify') {
          await SchoolService.updateVerificationStatus(schoolId, 'verified')
        } else {
          await SchoolService.updateVerificationStatus(
            schoolId,
            'rejected',
            'Rejetée lors de modération en masse'
          )
        }
      } catch (error) {
        console.error(`Erreur pour ${schoolId}:`, error)
      }
    }

    alert(`${selectedSchools.length} écoles ${action === 'verify' ? 'vérifiées' : 'rejetées'}`)
    setSelectedSchools([])
  }

  return (
    <div>
      <select value={action} onChange={e => setAction(e.target.value as any)}>
        <option value="verify">Approuver</option>
        <option value="reject">Rejeter</option>
      </select>

      <button
        onClick={handleBulkAction}
        disabled={selectedSchools.length === 0}
      >
        Appliquer à {selectedSchools.length} écoles
      </button>
    </div>
  )
}
```

## Exemple 7: Ajouter un Avis (Admin)

```typescript
'use client'

import { useState } from 'react'
import { SchoolService } from '@/lib/services/school-service'
import { useToast } from '@/hooks/use-toast'

export function AddSchoolReview({ schoolId }: { schoolId: string }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [studentName, setStudentName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await SchoolService.addSchoolReview(schoolId, {
        tutorId: 'admin-tutor-id',
        studentId: 'admin-student-id',
        studentName,
        rating,
        comment,
      })

      toast({
        title: 'Succès',
        description: 'Avis ajouté avec succès',
      })

      // Reset form
      setRating(5)
      setComment('')
      setStudentName('')
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter l\'avis',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h2>Ajouter un avis</h2>

      <div className="mb-4">
        <label>Nom de l'étudiant</label>
        <input
          type="text"
          value={studentName}
          onChange={e => setStudentName(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label>Note (1-5)</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label>Commentaire</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          required
          rows={4}
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Ajout en cours...' : 'Ajouter'}
      </button>
    </form>
  )
}
```

## Exemple 8: Hook Personnalisé pour une Classe Tuteur

```typescript
import { useEffect, useState } from 'react'
import { School } from '@/lib/types'
import { SchoolService } from '@/lib/services/school-service'

export function useTutorSchools(tutorId: string) {
  const [schools, setSchools] = useState<School[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const data = await SchoolService.getSchoolsByTutorId(tutorId)
        setSchools(data)
      } finally {
        setIsLoading(false)
      }
    }

    if (tutorId) {
      fetchSchools()
    }
  }, [tutorId])

  return { schools, isLoading }
}

// Utilisation:
// const { schools } = useTutorSchools('tutor-123')
```

## Exemple 9: Export Statistiques en CSV

```typescript
import { SchoolService } from '@/lib/services/school-service'

export async function exportSchoolsToCSV() {
  const schools = await SchoolService.getAllSchools()

  const csv = [
    ['Nom', 'Pays', 'Ville', 'Statut', 'Avis', 'Note', 'Étudiants'].join(','),
    ...schools.map(s =>
      [
        s.name,
        s.location.country,
        s.location.city,
        s.verificationStatus,
        s.reviewCount,
        s.rating,
        s.totalStudents,
      ].join(',')
    ),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `schools-${new Date().toISOString()}.csv`
  a.click()
}
```

## Exemple 10: Notification aux Créateurs d'École

```typescript
import { SchoolService } from '@/lib/services/school-service'
import { sendEmail } from '@/lib/email-service'

export async function notifySchoolVerification(schoolId: string) {
  const school = await SchoolService.getSchoolById(schoolId)
  
  if (!school) return

  const message = 
    school.verificationStatus === 'verified'
      ? 'Votre école a été vérifiée!'
      : `Votre école a été rejetée. Motif: ${school.verificationMessage}`

  await sendEmail({
    to: school.email || '',
    subject: `École ${school.verificationStatus}: ${school.name}`,
    body: message,
  })
}
```
