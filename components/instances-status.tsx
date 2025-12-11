import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Database } from "@/lib/types/database"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Instance = Database["public"]["Tables"]["whatsapp_instances"]["Row"]

interface InstancesStatusProps {
  instances: Instance[]
}

export function InstancesStatus({ instances }: InstancesStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500"
      case "connecting":
        return "bg-yellow-500"
      case "disconnected":
        return "bg-gray-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "connected":
        return "Conectado"
      case "connecting":
        return "Conectando"
      case "disconnected":
        return "Desconectado"
      case "error":
        return "Erro"
      default:
        return status
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Status das Instâncias</CardTitle>
        <CardDescription>Visão geral das suas conexões</CardDescription>
      </CardHeader>
      <CardContent>
        {instances.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="mb-4 text-sm text-muted-foreground">Nenhuma instância criada</p>
            <Button asChild size="sm">
              <Link href="/instances/new">Criar Instância</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {instances.map((instance) => (
              <div key={instance.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(instance.status)}`} />
                  <div>
                    <p className="text-sm font-medium">{instance.name}</p>
                    <p className="text-xs text-muted-foreground">{instance.phone_number || "Sem número"}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {getStatusLabel(instance.status)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
