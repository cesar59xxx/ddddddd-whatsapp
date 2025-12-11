"use client"

import type { Database } from "@/lib/types/database"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Eye } from "lucide-react"
import Link from "next/link"

type Lead = Database["public"]["Tables"]["leads"]["Row"] & {
  whatsapp_instances: {
    id: string
    name: string
  }
}

interface LeadsListProps {
  leads: Lead[]
}

export function LeadsList({ leads }: LeadsListProps) {
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

  if (leads.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">Nenhum lead encontrado</h3>
          <p className="text-sm text-muted-foreground">
            Seus leads aparecerão aqui quando começarem a conversar com seus chatbots
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {leads.map((lead) => (
        <Card key={lead.id} className="hover:bg-accent/50 transition-colors">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex flex-1 items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{lead.name || "Sem nome"}</h3>
                  <Badge variant="secondary" className={`${getStatusColor(lead.status)} text-white`}>
                    {getStatusLabel(lead.status)}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span>{lead.phone_number}</span>
                  {lead.email && <span>{lead.email}</span>}
                  <span>•</span>
                  <span>{lead.whatsapp_instances.name}</span>
                  {lead.last_interaction && (
                    <>
                      <span>•</span>
                      <span>Última interação: {new Date(lead.last_interaction).toLocaleString("pt-BR")}</span>
                    </>
                  )}
                </div>
                {lead.tags && lead.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {lead.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button asChild size="sm">
              <Link href={`/leads/${lead.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalhes
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
