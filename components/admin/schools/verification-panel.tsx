"use client"

import React from 'react'

export default function VerificationPanel({
  school,
  onApprove,
  onReject,
}: {
  school: any | null
  onApprove: (id: string) => void
  onReject: (id: string) => void
}) {
  if (!school) {
    return (
      <div className="rounded-lg bg-card p-4 text-center text-muted-foreground">Select a school to view documents</div>
    )
  }

  const docs = school.documents || [
    { id: '1', name: 'Registration.pdf', url: '#', type: 'registration' },
  ]

  return (
    <div className="space-y-4 rounded-lg bg-card p-4">
      <div className="flex items-center gap-4">
        <img src={school.logo} alt="logo" className="h-12 w-12 rounded-md object-cover" />
        <div>
          <div className="font-semibold text-foreground">{school.name}</div>
          <div className="text-sm text-muted-foreground">{school.location?.city}, {school.location?.country}</div>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium">Documents</div>
        <div className="mt-2 grid gap-2">
          {docs.map((d: any) => (
            <a key={d.id} href={d.url} className="flex items-center justify-between rounded-md border px-3 py-2">
              <div>
                <div className="font-medium">{d.name}</div>
                <div className="text-sm text-muted-foreground">{d.type}</div>
              </div>
              <div className="text-sm text-primary">Open</div>
            </a>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button className="rounded-md bg-green-600 px-4 py-2 text-white" onClick={() => onApprove(school.id)}>Approve</button>
        <button className="rounded-md bg-rose-600 px-4 py-2 text-white" onClick={() => onReject(school.id)}>Reject</button>
      </div>
    </div>
  )
}
