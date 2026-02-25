# Système d'Administration des Écoles

Un système complet de gestion des écoles de langue avec contrôle total sur la vérification, le blocage et la consultation des avis.

## 📋 Fonctionnalités

### Gestion Administrateur
- **Liste complète des écoles** avec filtrage par statut et recherche
- **Vérification des écoles** en attente avec motif de rejet/approbation
- **Blocage/Déblocage** des écoles
- **Statistiques globales** des écoles
- **Détails complets** de chaque école (informations, créateur, contact)

### Avis et Évaluations
- **Consultation des avis par école** depuis la sous-collection Firebase
- **Distribution des notes** (graphique en barres)
- **Tendances des avis** (derniers 6 mois)
- **Affichage des avis** avec auteur, date et photo

### Gestion des Données
- Filtrage par statut de vérification (Vérifiée, En attente, Bloquée)
- Recherche en temps réel
- Statistiques en temps réel

## 🏗️ Architecture

### Services
**[lib/services/school-service.ts](lib/services/school-service.ts)**
- `getAllSchools()` - Récupère toutes les écoles
- `getSchoolById(schoolId)` - Récupère une école spécifique
- `getSchoolsByTutorId(tutorId)` - Écoles d'un créateur
- `getSchoolReviews(schoolId)` - Avis d'une école
- `addSchoolReview()` - Ajouter un avis
- `updateVerificationStatus()` - Vérifier/Rejeter une école
- `toggleSchoolBlocked()` - Bloquer/Débloquer
- `getSchoolStats()` - Statistiques d'une école
- `updateSchool()` - Mettre à jour une école
- `searchSchools()` - Recherche avancée

### Composants
1. **[components/admin/schools/admin-schools-list.tsx](components/admin/schools/admin-schools-list.tsx)**
   - Liste principale des écoles
   - Filtres et recherche
   - Actions rapides (Voir, Vérifier, Bloquer)

2. **[components/admin/schools/school-details-dialog.tsx](components/admin/schools/school-details-dialog.tsx)**
   - Fenêtre détails d'une école
   - Informations complètes
   - Affichage des avis
   - Actions de blocage

3. **[components/admin/schools/school-reviews-list.tsx](components/admin/schools/school-reviews-list.tsx)**
   - Liste des avis avec photos
   - Évaluations en étoiles
   - Dates et commentaires

4. **[components/admin/schools/schools-stats-widget.tsx](components/admin/schools/schools-stats-widget.tsx)**
   - Widget de statistiques globales
   - Cartes de KPI (écoles, étudiants, notes)

5. **[components/admin/schools/school-moderation-dialog.tsx](components/admin/schools/school-moderation-dialog.tsx)**
   - Dialogue de modération avancée
   - Formulaire de rejet avec motif

6. **[components/admin/schools/school-stats-details.tsx](components/admin/schools/school-stats-details.tsx)**
   - Graphiques détaillés par école
   - Distribution des notes
   - Tendances mensuelles

### Hooks
**[hooks/use-schools.ts](hooks/use-schools.ts)**
```typescript
const {
  schools,
  isLoading,
  error,
  fetchSchools,
  blockSchool,
  unblockSchool,
  verifySchool,
  rejectSchool,
  updateSchool,
} = useSchools()
```

## 📱 UI Components Utilisés

- `Button` - Boutons d'action
- `Dialog` - Modales
- `Table` - Affichage des listes
- `Badge` - Statuts colorés
- `Input` - Champs de texte
- `Select` - Filtres
- `Textarea` - Zone de texte pour motifs
- `Card` - Conteneurs
- `Skeleton` - Chargement

## 🔄 Flux de Travail d'Administration

### 1. Vérification d'une École
```
École créée (pending) 
→ Admin voit l'école en attente
→ Admin clique sur "Voir détails"
→ Admin approuve → verified ✓
   OU rejette → rejected (avec motif)
```

### 2. Blocage d'une École
```
École vérifiée (verified)
→ Admin détecte problème
→ Admin clique "Bloquer"
→ École passe à rejected
→ Admin peut débloquer si nécessaire
```

### 3. Consultation des Avis
```
Admin voit une école
→ Clique sur "Voir détails"
→ Scrolle jusqu'à "Avis (Reviews)"
→ Voit tous les avis avec auteur et date
→ Peut consulter les graphiques
```

## 📊 Statistiques Disponibles

### Widget Global
- Total d'écoles
- Écoles vérifiées
- Écoles en attente
- Écoles bloquées
- Étudiants totaux
- Note moyenne

### Par École
- Distribution des notes (5,4,3,2,1)
- Avis par mois (derniers 6 mois)
- Note moyenne
- Nombre d'avis

## 🔧 Configuration Firebase

Structure Firestore requise:
```
schools (collection)
├── {schoolId}
│   ├── id: string
│   ├── tutorId: string
│   ├── name: string
│   ├── location: { city, country, ...}
│   ├── verificationStatus: "pending" | "verified" | "rejected"
│   ├── rating: number
│   ├── reviewCount: number
│   ├── createdAt: Timestamp
│   └── reviews (subcollection)
│       └── {reviewId}
│           ├── id: string
│           ├── studentId: string
│           ├── studentName: string
│           ├── rating: 1-5
│           ├── comment: string
│           └── createdAt: Timestamp
```

## 🚀 Utilisation

### Navigation
- Sidebar → Schools
- ou `/dashboard/admin/schools`

### Recherche
```
1. Entrez un nom d'école ou une ville
2. Sélectionnez un statut dans le filtre
3. Les résultats se filtrent en temps réel
```

### Actions Rapides
- **👁️ Voir** - Ouvre les détails complets
- **✓ Vérifier** - Pour les écoles en attente
- **🔒 Bloquer / Débloquer** - Contrôle d'accès

## 📝 Types TypeScript

Tous les types sont définis dans [lib/types.ts](lib/types.ts):

```typescript
interface School {
  id: string
  tutorId: string // Créateur
  name: string
  logo?: string
  location: { city, country, address?, ...}
  verificationStatus: "pending" | "verified" | "rejected"
  rating: number
  reviewCount: number
  description?: string
  email?: string
  phone?: string
  // ... plus de propriétés
}

interface Review {
  id: string
  tutorId: string
  studentId: string
  studentName: string
  rating: number
  comment: string
  createdAt: Date
}
```

## ✨ Améliorations Futures

- [ ] Export des statistiques en CSV
- [ ] Historique des modifications
- [ ] Notifications aux créateurs d'école
- [ ] Éditeur de profil école
- [ ] Gestion des images
- [ ] Tri personnalisé des colonnes
- [ ] Pagination complète
- [ ] Bulk actions

## 🔐 Sécurité

- ✅ Protection admin requise
- ✅ Vérification des permissions
- ✅ Historique des actions
- ✅ Messages de motif conservés
- ✅ Validation des données

## 📞 Support

Pour toute question sur le système d'administration des écoles:
1. Vérifiez la structure Fischer Firestore
2. Assurez-vous que les types School sont à jour
3. Vérifiez les permissions Firestore
