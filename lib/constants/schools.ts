// School Admin Configuration and Constants

export const SCHOOL_VERIFICATION_STATUSES = [
  { value: "pending", label: "En attente", color: "yellow" },
  { value: "verified", label: "Vérifiée", color: "green" },
  { value: "rejected", label: "Bloquée", color: "red" },
] as const

export const SCHOOL_COLUMNS = [
  { key: "name", label: "Nom" },
  { key: "location", label: "Localisation" },
  { key: "verificationStatus", label: "Statut" },
  { key: "reviewCount", label: "Avis" },
  { key: "rating", label: "Note" },
  { key: "totalStudents", label: "Étudiants" },
  { key: "actions", label: "Actions" },
] as const

export const SCHOOL_FILTERS = {
  status: [
    { value: "all", label: "Tous les statuts" },
    { value: "verified", label: "Vérifiée" },
    { value: "pending", label: "En attente" },
    { value: "rejected", label: "Bloquée" },
  ],
} as const

export const SCHOOL_TOAST_MESSAGES = {
  success: {
    verified: "École vérifiée avec succès",
    rejected: "École rejetée",
    blocked: "École bloquée",
    unblocked: "École débloquée",
    updated: "Informations mises à jour",
  },
  error: {
    failed: "Une erreur s'est produite",
    loadFailed: "Impossible de charger les écoles",
    updateFailed: "Impossible de mettre à jour l'école",
    invalidMessage: "Veuillez entrer un motif de rejet",
  },
} as const

export const SCHOOL_STATS_LABELS = {
  totalSchools: "Écoles totales",
  verifiedSchools: "Vérifiées",
  pendingSchools: "En attente",
  blockedSchools: "Bloquées",
  totalStudents: "Étudiants totaux",
  averageRating: "Note moyenne",
} as const

export const DEFAULT_SCHOOL_LOGO = "https://via.placeholder.com/40"

export const PAGINATION_LIMITS = {
  schoolsList: 20,
  reviewsList: 10,
  activityWidget: 10,
} as const

export const CHART_COLORS = {
  primary: "#3b82f6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  secondary: "#8b5cf6",
} as const
