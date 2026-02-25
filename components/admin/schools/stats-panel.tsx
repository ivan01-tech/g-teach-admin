"use client"

import React from 'react'
import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
} from '@/components/ui/chart'
import * as Recharts from 'recharts'

export default function StatsPanel({ data }: { data: any }) {
  const byCountry = Object.entries(data.byCountry || {}).map(([k, v]) => ({ name: k, value: v }))
  const searchedCities = data.mostSearchedCities || []

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-card p-4">
          <div className="text-sm font-medium">Totals</div>
          <div className="mt-3 flex gap-4">
            <div className="rounded-md bg-muted px-3 py-2">
              <div className="text-xs text-muted-foreground">Total schools</div>
              <div className="text-lg font-semibold">{data.total}</div>
            </div>
            <div className="rounded-md bg-muted px-3 py-2">
              <div className="text-xs text-muted-foreground">Verified</div>
              <div className="text-lg font-semibold">{data.verified}</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4">
          <div className="text-sm font-medium">Most searched cities</div>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {searchedCities.map((c: any, i: number) => (
              <li key={i}>{c.city} ({c.count})</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-card p-4">
          <div className="text-sm font-medium">Schools by country</div>
          <div className="mt-3 h-48">
            <ChartContainer id="countries" config={{ series: { color: '#6b7280' } }}>
              <Recharts.ResponsiveContainer>
                <Recharts.BarChart data={byCountry}>
                  <Recharts.Tooltip content={<ChartTooltipContent />} />
                  <Recharts.XAxis dataKey="name" />
                  <Recharts.Bar dataKey="value" fill="var(--color-series)" />
                </Recharts.BarChart>
              </Recharts.ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4">
          <div className="text-sm font-medium">Verification mix</div>
          <div className="mt-3 h-48">
            <ChartContainer id="verify" config={{ verified: { color: '#10b981' }, pending: { color: '#f59e0b' } }}>
              <Recharts.PieChart>
                <Recharts.Pie data={data.verificationPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} label />
                <Recharts.Tooltip content={<ChartTooltipContent />} />
                <Recharts.Legend content={<ChartLegendContent />} />
              </Recharts.PieChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
