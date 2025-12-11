import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Users, TrendingUp, Zap } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    instances: number
    totalInstances: number
    leads: number
    newLeads: number
    messages: number
    conversionRate: string
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Instâncias Ativas</p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-bold">
                  {stats.instances}
                  <span className="text-base text-muted-foreground">/{stats.totalInstances}</span>
                </p>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Leads Totais</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold">{stats.leads}</p>
                {stats.newLeads > 0 && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    +{stats.newLeads} novos
                  </span>
                )}
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Mensagens Hoje</p>
              <p className="text-3xl font-bold">{stats.messages}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Zap className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Taxa de Conversão</p>
              <p className="text-3xl font-bold">{stats.conversionRate}%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
