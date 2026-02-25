"use client"

import React from 'react'

export interface School {
  id: string
  name: string
  logo: string
  location: { city: string; country: string }
  exams: string[]
  isVerified: boolean
  rating: number
  reviewCount: number
  levels: string[]
  description?: string
}

export default function SchoolCard({
  school,
  onPreview,
}: {
  school: School
  onPreview: (s: School) => void
}) {
  return (
    <div className="group flex gap-4 rounded-lg bg-card p-4 shadow-sm hover:shadow-md">
      <img src={school.logo} alt="logo" className="h-14 w-14 rounded-md object-cover" />
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-foreground">{school.name}</div>
            <div className="text-sm text-muted-foreground">{school.location.city}, {school.location.country}</div>
          </div>
          <div className="text-sm text-muted-foreground">{school.rating.toFixed(1)} · {school.reviewCount}</div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className={`rounded-full px-2 py-0.5 text-xs ${school.isVerified ? 'bg-green-600 text-white' : 'bg-amber-600 text-black'}`}>
            {school.isVerified ? 'Verified' : 'Pending'}
          </div>
          <button className="ml-auto text-sm underline" onClick={() => onPreview(school)}>Preview</button>
        </div>
      </div>
    </div>
  )
}
