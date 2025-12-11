import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Database } from "@/lib/types/database"
import { Users, ArrowRight } from "lucide-react"
import Link from "next/link"

type Lead = Database["public"]["Tables"]["leads"]["Row"] & {
  whatsapp_instances: {
    name: string
  } | null
}

interface RecentLeadsProps {
  leads: Lead[]
}

export function RecentLeads({ leads }: RecentLeadsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500"
      case "contacted":
        return "bg-yellow-500"
      case "qualified":
        return "bg-purple-500"
      case "converted":
        return "bg-green-500"
      case "lost":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "Novo"
      case "contacted":
        return "Contatado"
      case "qualified":
        return "Qualificado"
      case "converted":
        return "Convertido"
      case "lost":
        return "Perdido"
      default:
        return status
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Leads Recentes</CardTitle>
            <CardDescription>Últimos contatos capturados</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/leads">
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Nenhum lead capturado ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => (
              <Link
                key={lead.id}
                href={`/leads/${lead.id}`}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{lead.name || "Sem nome"}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{lead.phone_number}</span>
                      {lead.whatsapp_instances && (
                        <>
                          <span>•</span>
                          <span>{lead.whatsapp_instances.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className={`${getStatusColor(lead.status)} text-white`}>
                  {getStatusLabel(lead.status)}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
