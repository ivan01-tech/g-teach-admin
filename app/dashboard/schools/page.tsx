"use client"

import React from 'react'
import AdminHeader from '@/components/admin/admin-header'
import AdminSidebar from '@/components/admin/admin-sidebar'
import SchoolList from '@/components/admin/schools/school-list'
import VerificationPanel from '@/components/admin/schools/verification-panel'
import StatsPanel from '@/components/admin/schools/stats-panel'
import AddSchoolForm from '@/components/admin/schools/add-school-form'

const MOCK_SCHOOLS = [
  {
    id: 's1',
    name: 'Global Language Center',
    logo: '/logo.png',
    location: { city: 'Berlin', country: 'Germany' },
    exams: ['goethe', 'telc'],
    isVerified: false,
    rating: 4.5,
    reviewCount: 24,
    levels: ['a1', 'a2'],
    description: 'Experienced teachers',
    documents: [{ id: 'd1', name: 'Registration.pdf', url: '#' }],
  },
  {
    id: 's2',
    name: 'Language Hub',
    logo: '/logo2.png',
    location: { city: 'Munich', country: 'Germany' },
    exams: ['goethe'],
    isVerified: true,
    rating: 4.8,
    reviewCount: 98,
    levels: ['b1', 'b2'],
    documents: [{ id: 'd2', name: 'License.pdf', url: '#' }],
  },
]

export default function Page() {
  const [schools, setSchools] = React.useState(MOCK_SCHOOLS)
  const [selected, setSelected] = React.useState<any | null>(null)
  const [showAdd, setShowAdd] = React.useState(false)
  const [filter, setFilter] = React.useState<'all' | 'pending' | 'verified' | 'rejected'>('pending')

  const handlePreview = (s: any) => setSelected(s)

  const approve = (id: string) => {
    setSchools((prev) => prev.map((p: any) => (p.id === id ? { ...p, isVerified: true } : p)))
    if (selected?.id === id) setSelected({ ...selected, isVerified: true })
  }

  const reject = (id: string) => {
    setSchools((prev) => prev.filter((p: any) => p.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const handleCreate = (s: any) => {
    setSchools((prev) => [s, ...prev])
    setSelected(s)
  }

  const stats = {
    total: schools.length,
    verified: schools.filter((s) => s.isVerified).length,
    byCountry: { Germany: schools.length },
    mostSearchedCities: [{ city: 'Berlin', count: 120 }, { city: 'Munich', count: 80 }],
    verificationPie: [
      { name: 'Verified', value: schools.filter((s) => s.isVerified).length },
      { name: 'Pending', value: schools.filter((s) => !s.isVerified).length },
    ],
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <aside className="w-64">
          <AdminSidebar />
        </aside>

        <main className="flex-1 p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Language Schools — Pending approvals</h2>
                <div>
                  <button className="rounded-md bg-primary px-3 py-1 text-white" onClick={() => setShowAdd(true)}>Ajouter une école</button>
                </div>
              </div>
              <div className="mt-4">
                <SchoolList
                  schools={schools}
                  onPreview={handlePreview}
                  filterStatus={filter}
                  onFilterChange={(v) => setFilter(v)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Verification</h3>
              <div className="mt-4">
                <VerificationPanel school={selected} onApprove={approve} onReject={reject} />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium">Statistics</h3>
            <div className="mt-3">
              <StatsPanel data={stats} />
            </div>
          </div>
        </main>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-6">
          <div className="w-full max-w-3xl">
            <AddSchoolForm onCreate={handleCreate} onClose={() => setShowAdd(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
