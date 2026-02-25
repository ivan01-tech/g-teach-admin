# Schools Admin API Specifications

## Overview
Documentation complète du système d'administration des écoles pour intégration et extension.

## Service API (SchoolService)

### getAllSchools()
Récupère toutes les écoles de la collection Firestore.

**Returns:** `Promise<School[]>`

```typescript
const schools = await SchoolService.getAllSchools()
```

### getSchoolById(schoolId: string)
Récupère une école spécifique par son ID.

**Parameters:**
- `schoolId: string` - L'ID unique de l'école

**Returns:** `Promise<School | null>`

```typescript
const school = await SchoolService.getSchoolById('school-123')
```

### getSchoolsByTutorId(tutorId: string)
Récupère toutes les écoles créées par un tuteur spécifique.

**Parameters:**
- `tutorId: string` - L'ID du tuteur (créateur)

**Returns:** `Promise<School[]>`

```typescript
const schoolsByTutor = await SchoolService.getSchoolsByTutorId('tutor-456')
```

### getSchoolReviews(schoolId: string)
Récupère les avis d'une école depuis sa sous-collection Firestore.

**Parameters:**
- `schoolId: string` - L'ID de l'école

**Returns:** `Promise<Review[]>`

```typescript
const reviews = await SchoolService.getSchoolReviews('school-123')
// Retourne les avis triés par date décroissante
```

### addSchoolReview(schoolId: string, review: Omit<Review, 'id' | 'createdAt'>)
Ajoute un nouvel avis à une école.

**Parameters:**
- `schoolId: string` - L'ID de l'école
- `review: Omit<Review, 'id' | 'createdAt'>` - Les données de l'avis

**Returns:** `Promise<string>` - L'ID du nouvel avis

```typescript
const reviewId = await SchoolService.addSchoolReview('school-123', {
  tutorId: 'tutor-456',
  studentId: 'student-789',
  studentName: 'John Doe',
  rating: 5,
  comment: 'Excellent école!',
})
```

### updateVerificationStatus(schoolId: string, status: VerificationStatus, message?: string)
Met à jour le statut de vérification d'une école (admin uniquement).

**Parameters:**
- `schoolId: string` - L'ID de l'école
- `status: 'pending' | 'verified' | 'rejected'` - Nouveau statut
- `message?: string` - Message optionnel (motif de rejet)

**Returns:** `Promise<void>`

```typescript
// Approuver une école
await SchoolService.updateVerificationStatus('school-123', 'verified')

// Rejeter une école avec motif
await SchoolService.updateVerificationStatus(
  'school-123',
  'rejected',
  'Informations manquantes ou incorrectes'
)
```

### toggleSchoolBlocked(schoolId: string, isBlocked: boolean)
Bloque ou débloque une école.

**Parameters:**
- `schoolId: string` - L'ID de l'école
- `isBlocked: boolean` - True pour bloquer, False pour débloquer

**Returns:** `Promise<void>`

```typescript
await SchoolService.toggleSchoolBlocked('school-123', true) // Bloquer
await SchoolService.toggleSchoolBlocked('school-123', false) // Débloquer
```

### getSchoolStats(schoolId: string)
Récupère les statistiques d'une école.

**Parameters:**
- `schoolId: string` - L'ID de l'école

**Returns:** `Promise<{totalReviews: number, averageRating: number, recentReviews: number}>`

```typescript
const stats = await SchoolService.getSchoolStats('school-123')
// {
//   totalReviews: 42,
//   averageRating: 4.5,
//   recentReviews: 5  // derniers 30 jours
// }
```

### updateSchool(schoolId: string, updates: Partial<School>)
Met à jour les informations d'une école.

**Parameters:**
- `schoolId: string` - L'ID de l'école
- `updates: Partial<School>` - Champs à mettre à jour

**Returns:** `Promise<void>`

```typescript
await SchoolService.updateSchool('school-123', {
  rating: 4.8,
  reviewCount: 50,
  totalStudents: 100,
})
```

### deleteSchool(schoolId: string)
Marque une école comme supprimée (soft delete).

**Parameters:**
- `schoolId: string` - L'ID de l'école

**Returns:** `Promise<void>`

```typescript
await SchoolService.deleteSchool('school-123')
```

### searchSchools(filters: {country?, city?, verificationStatus?, isBlocked?})
Recherche les écoles avec filtres.

**Parameters:**
```typescript
{
  country?: string          // Pays
  city?: string            // Ville
  verificationStatus?: VerificationStatus  // Statut
  isBlocked?: boolean      // Bloqée ou non
}
```

**Returns:** `Promise<School[]>`

```typescript
const results = await SchoolService.searchSchools({
  country: 'France',
  city: 'Paris',
  verificationStatus: 'verified'
})
```

## Hook useSchools()

Hook personnalisé pour gérer les écoles dans un composant.

```typescript
const {
  schools,           // School[] - Liste des écoles
  isLoading,         // boolean - État de chargement
  error,            // string | null - Erreurs
  fetchSchools,     // () => Promise<void> - Récupérer toutes les écoles
  blockSchool,      // (id: string) => Promise<void> - Bloquer
  unblockSchool,    // (id: string) => Promise<void> - Débloquer
  verifySchool,     // (id: string) => Promise<void> - Vérifier
  rejectSchool,     // (id: string, msg?: string) => Promise<void> - Rejeter
  updateSchool,     // (id: string, updates: Partial<School>) => Promise<void>
} = useSchools()
```

### Exemple d'utilisation

```typescript
'use client'

import { useSchools } from '@/hooks/use-schools'

export function MyComponent() {
  const { schools, isLoading, verifySchool } = useSchools()

  const handleVerify = async (schoolId: string) => {
    try {
      await verifySchool(schoolId)
      console.log('École vérifiée!')
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  return (
    <div>
      {schools.map(school => (
        <button key={school.id} onClick={() => handleVerify(school.id)}>
          Vérifier {school.name}
        </button>
      ))}
    </div>
  )
}
```

## Components

### AdminSchoolsList
Liste principale avec filtres et actions.

**Props:**
```typescript
// Aucune prop requise - utilise les states internes
```

### SchoolDetailsDialog
Modal pour afficher les détails complets d'une école.

**Props:**
```typescript
interface SchoolDetailsDialogProps {
  school: School | null
  isOpen: boolean
  onClose: () => void
}
```

### SchoolReviewsList
Liste des avis avec pagination.

**Props:**
```typescript
interface SchoolReviewsListProps {
  schoolId: string
}
```

### SchoolsStatsWidget
Widget statistiques globales.

**Props:**
```typescript
// Aucune prop requise
```

### SchoolModerationDialog
Modal de modération avancée pour approuver/rejeter.

**Props:**
```typescript
interface SchoolModerationDialogProps {
  school: School | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate?: () => void
}
```

### SchoolStatsDetails
Graphiques détaillés d'une école.

**Props:**
```typescript
interface SchoolStatsDetailsProps {
  schoolId: string
}
```

### SchoolsActivityWidget
Widget d'activité récente.

**Props:**
```typescript
// Aucune prop requise
```

## Firestore Structure

```
schools (collection)
├── {schoolId: string}
│   ├── id: string
│   ├── tutorId: string (créateur)
│   ├── name: string
│   ├── logo: string | null
│   ├── location: {
│   │   city: string
│   │   country: string
│   │   address?: string | null
│   │   latitude: number | null
│   │   longitude: number | null
│   │}
│   ├── exams: string[]
│   ├── levels: string[]
│   ├── verificationStatus: "pending" | "verified" | "rejected"
│   ├── verificationMessage?: string
│   ├── rating: number
│   ├── reviewCount: number
│   ├── totalStudents?: number
│   ├── totalLessons?: number
│   ├── description?: string
│   ├── about?: string
│   ├── email?: string
│   ├── phone?: string
│   ├── website?: string
│   ├── isBlocked?: boolean
│   ├── createdAt: Timestamp
│   ├── updatedAt: Timestamp
│   └── reviews (sub-collection)
│       └── {reviewId: string}
│           ├── id: string
│           ├── tutorId: string
│           ├── studentId: string
│           ├── studentName: string
│           ├── studentPhoto?: string
│           ├── rating: 1-5
│           ├── comment: string
│           └── createdAt: Timestamp
```

## Règles Firestore Recommandées

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /schools/{document=**} {
      // Lecture: Tous (pour public)
      allow read: if true;
      
      // Écriture: Créateur ou Admin uniquement
      allow create: if request.auth != null && 
                       resource.data.tutorId == request.auth.uid;
      
      allow update: if request.auth != null && 
                       (resource.data.tutorId == request.auth.uid ||
                        isAdmin(request.auth.uid));
      
      allow delete: if request.auth != null && 
                       isAdmin(request.auth.uid);
    }
  }
  
  function isAdmin(uid) {
    return exists(/databases/$(database)/documents/admins/$(uid));
  }
}
```

## Error Handling

Tous les services catchent les erreurs et les loguent:

```typescript
try {
  const school = await SchoolService.getSchoolById(schoolId)
} catch (error) {
  console.error("Erreur lors de la récupération de l'école:", error)
  throw error // Relancer pour le composant
}
```

## Performance Notes

- Les avis sont triés par date (décroissant) côté Firestore
- Pas de pagination implémentée côté service (à faire si > 1000 écoles)
- Les statistiques sont calculées en mémoire (optimiser si gros volume)
- Les recherches utilisent les conditions Firestore (pas de full-text search)

## Améliorations Futures

- [ ] Pagination avec cursors
- [ ] Caching côté client (SWR/Tanstack Query)
- [ ] Full-text search avec Algolia
- [ ] WebSocket pour updates en temps réel
- [ ] Analytics détaillés par école
- [ ] Batch operations
