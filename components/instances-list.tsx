"use client"

import type { Database } from "@/lib/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Settings, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

type Instance = Database["public"]["Tables"]["whatsapp_instances"]["Row"]

interface InstancesListProps {
  instances: Instance[]
}

export function InstancesList({ instances }: InstancesListProps) {
  const router = useRouter()
  const supabase = createClient()
  const [deleting, setDeleting] = useState<string | null>(null)

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

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta instância?")) {
      return
    }

    setDeleting(id)
    const { error } = await supabase.from("whatsapp_instances").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting instance:", error)
      alert("Erro ao excluir instância")
    } else {
      router.refresh()
    }
    setDeleting(null)
  }

  if (instances.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">Nenhuma instância encontrada</h3>
          <p className="mb-4 text-sm text-muted-foreground">Comece criando sua primeira instância do WhatsApp</p>
          <Button asChild>
            <Link href="/instances/new">Criar Primeira Instância</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {instances.map((instance) => (
        <Card key={instance.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${getStatusColor(instance.status)}`} />
                <CardTitle className="text-lg">{instance.name}</CardTitle>
              </div>
              <Badge variant="secondary">{getStatusLabel(instance.status)}</Badge>
            </div>
            <CardDescription>{instance.phone_number || "Número não conectado"}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-end gap-2">
            <Button asChild className="w-full">
              <Link href={`/instances/${instance.id}`}>
                <Settings className="mr-2 h-4 w-4" />
                Gerenciar
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full text-destructive bg-transparent"
              onClick={() => handleDelete(instance.id)}
              disabled={deleting === instance.id}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleting === instance.id ? "Excluindo..." : "Excluir"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
