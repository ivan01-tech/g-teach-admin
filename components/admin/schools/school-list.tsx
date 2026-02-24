"use client"

import React from 'react'
import SchoolCard, { School } from './school-card'

export default function SchoolList({
  schools,
  onPreview,
  filterStatus,
  onFilterChange,
}: {
  schools: School[]
  onPreview: (s: School) => void
  filterStatus: 'all' | 'pending' | 'verified' | 'rejected'
  onFilterChange: (v: 'all' | 'pending' | 'verified' | 'rejected') => void
}) {
  const filtered = schools.filter((s) =>
    filterStatus === 'all' ? true : filterStatus === 'pending' ? !s.isVerified : filterStatus === 'verified' ? s.isVerified : true,
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="text-sm font-medium">Verification</div>
        <select
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value as any)}
          className="ml-2 rounded-md border px-2 py-1"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="grid gap-3">
        {filtered.map((s) => (
          <SchoolCard key={s.id} school={s} onPreview={onPreview} />
        ))}
      </div>
    </div>
  )
}
