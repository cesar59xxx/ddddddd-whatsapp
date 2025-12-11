"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Database } from "@/lib/types/database"
import { BarChart3 } from "lucide-react"

type AnalyticsEvent = Database["public"]["Tables"]["analytics_events"]["Row"]

interface ActivityChartProps {
  activityData: AnalyticsEvent[]
}

export function ActivityChart({ activityData }: ActivityChartProps) {
  // Group events by day
  const groupedByDay = activityData.reduce(
    (acc, event) => {
      const date = new Date(event.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })
      if (!acc[date]) {
        acc[date] = { messages: 0, leads: 0 }
      }
      if (event.event_type === "message_received" || event.event_type === "message_sent") {
        acc[date].messages++
      } else if (event.event_type === "lead_created") {
        acc[date].leads++
      }
      return acc
    },
    {} as Record<string, { messages: number; leads: number }>,
  )

  const chartData = Object.entries(groupedByDay)
    .map(([date, data]) => ({
      date,
      messages: data.messages,
      leads: data.leads,
    }))
    .slice(-7)

  const maxValue = Math.max(...chartData.map((d) => Math.max(d.messages, d.leads)), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade dos Últimos 7 Dias</CardTitle>
        <CardDescription>Mensagens e novos leads por dia</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Nenhuma atividade registrada nos últimos 7 dias</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chartData.map((item) => (
              <div key={item.date} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.date}</span>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{item.messages} mensagens</span>
                    <span>{item.leads} leads</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div
                    className="h-8 rounded bg-primary transition-all"
                    style={{
                      width: `${(item.messages / maxValue) * 100}%`,
                      minWidth: item.messages > 0 ? "2%" : "0",
                    }}
                  />
                  <div
                    className="h-8 rounded bg-blue-500 transition-all"
                    style={{
                      width: `${(item.leads / maxValue) * 100}%`,
                      minWidth: item.leads > 0 ? "2%" : "0",
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-center gap-6 pt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-primary" />
                <span>Mensagens</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-blue-500" />
                <span>Leads</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
