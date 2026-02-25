import AdminHeader from "@/components/admin/admin-header"
import AdminProtection from "@/components/admin/admin-protection"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { AdminSchoolsList } from "@/components/admin/schools/admin-schools-list"
import { SchoolsStatsWidget } from "@/components/admin/schools/schools-stats-widget"

export default function AdminSchoolsPage() {
  return (
    // <AdminProtection>
      <div className="flex h-screen bg-gray-50">
        {/* <AdminSidebar /> */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* <AdminHeader  onSidebarToggle={() => {}} sidebarOpen={true} /> */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto py-8 px-4">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestion des Écoles
                </h1>
                <p className="text-gray-600 mt-2">
                  Gérez les écoles de langue, vérifiez-les, bloquez-les et
                  consultez leurs avis
                </p>
              </div>

              {/* Statistiques */}
              <div className="mb-8">
                <SchoolsStatsWidget />
              </div>

              {/* Liste des écoles */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">
                    Liste des écoles
                  </h2>
                </div>
                <AdminSchoolsList />
              </div>
            </div>
          </div>
        </div>
      </div>
    // </AdminProtection>
  )
}
